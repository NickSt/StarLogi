
import { ConstructionAnalysis, PlanetStrategy, ManufacturingSite, ItemData, PlanetData } from "../types";

/**
 * Recursively calculates all raw resources needed and identifies 
 * which intermediate constructible items are part of the chain.
 */
function getLogisticsChain(itemNames: string[], allItems: ItemData[]) {
  const rawTotals: Record<string, number> = {};
  const requiredIntermediateItems = new Set<string>();

  function processItem(name: string, multiplier: number, isRoot: boolean = false) {
    const item = allItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    
    if (!item) {
      // It's a raw resource
      rawTotals[name] = (rawTotals[name] || 0) + multiplier;
      return;
    }

    // If it's constructible and not one of the user's final targets, it's an intermediate
    if (!isRoot) {
      requiredIntermediateItems.add(item.name);
    }

    for (const req of item.requirements) {
      const amount = parseInt(req.amount) || 1;
      processItem(req.name, multiplier * amount, false);
    }
  }

  itemNames.forEach(name => processItem(name, 1, true));
  
  return {
    rawTotals,
    intermediateItems: Array.from(requiredIntermediateItems)
  };
}

/**
 * Checks if a planet has all the base raw materials required to build a specific item locally.
 */
function canManufactureLocally(planetResources: string[], itemName: string, allItems: ItemData[]): string[] | null {
  const item = allItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (!item) return null;
  
  // Get raw requirements for JUST this sub-item
  const { rawTotals } = getLogisticsChain([itemName], allItems);
  const rawReqs = Object.keys(rawTotals);
  
  const missing = rawReqs.filter(r => !planetResources.includes(r));
  return missing.length === 0 ? rawReqs : null;
}

export const getLocalConstructionStrategy = (
  itemNames: string[], 
  allItems: ItemData[], 
  allPlanets: PlanetData[]
): ConstructionAnalysis => {
  if (itemNames.length === 0) throw new Error("No items selected.");

  const { rawTotals, intermediateItems } = getLogisticsChain(itemNames, allItems);
  let remainingResources = Object.keys(rawTotals);
  const recommendedPlanets: PlanetStrategy[] = [];

  // 1. Identify Extraction Sites (Greedy Search)
  while (remainingResources.length > 0) {
    let bestPlanet: PlanetData | null = null;
    let maxCoverage: string[] = [];
    
    for (const planet of allPlanets) {
      const coverage = planet.resources.filter(r => remainingResources.includes(r));
      if (coverage.length > maxCoverage.length) {
        maxCoverage = coverage;
        bestPlanet = planet;
      }
    }

    if (!bestPlanet || maxCoverage.length === 0) {
      const missing = remainingResources[0];
      recommendedPlanets.push({
        planetName: "Trade Authority Vendor",
        system: "Various",
        resourcesFound: [missing],
        notes: "Acquire via vendors.",
        links: [],
        linkCount: 0
      });
      remainingResources = remainingResources.filter(r => r !== missing);
    } else {
      recommendedPlanets.push({
        planetName: bestPlanet.name,
        system: bestPlanet.system,
        resourcesFound: maxCoverage,
        notes: `Extraction site for ${maxCoverage.join(', ')}.`,
        links: [],
        linkCount: 0
      });
      remainingResources = remainingResources.filter(r => !maxCoverage.includes(r));
    }
  }

  // 2. Assign the Assembly Hub
  const assemblyHubStrategy = recommendedPlanets.reduce((prev, current) => 
    (current.resourcesFound.length > prev.resourcesFound.length) ? current : prev
  , recommendedPlanets[0]);
  
  if (assemblyHubStrategy) {
    assemblyHubStrategy.isAssemblyHub = true;
    assemblyHubStrategy.finalAssemblyItems = itemNames;
  }
  
  const hubName = assemblyHubStrategy?.planetName || "Unknown Hub";
  const hubSystem = assemblyHubStrategy?.system || "Unknown System";

  // 3. Process Manufacturing Assignments
  const manufacturingNodes: ManufacturingSite[] = [];
  const unassignedIntermediates = new Set(intermediateItems);

  recommendedPlanets.forEach(strat => {
    const planetData = allPlanets.find(p => p.name === strat.planetName);
    if (!planetData) return;

    // Check if this extraction site can handle any intermediate manufacturing locally
    intermediateItems.forEach(itemName => {
      const components = canManufactureLocally(strat.resourcesFound, itemName, allItems);
      if (components) {
        manufacturingNodes.push({ planetName: strat.planetName, itemName: itemName, components });
        strat.isManufacturingSite = true;
        strat.manufacturedItems = [...(strat.manufacturedItems || []), itemName];
        unassignedIntermediates.delete(itemName);
      }
    });
  });

  // 4. Any intermediate items that couldn't be built at source are built at the Hub
  if (assemblyHubStrategy) {
    unassignedIntermediates.forEach(itemName => {
      assemblyHubStrategy.isManufacturingSite = true;
      assemblyHubStrategy.manufacturedItems = [...(assemblyHubStrategy.manufacturedItems || []), itemName];
      
      const { rawTotals: itemRaw } = getLogisticsChain([itemName], allItems);
      manufacturingNodes.push({ 
        planetName: hubName, 
        itemName: itemName, 
        components: Object.keys(itemRaw) 
      });
    });
  }

  // 5. Build Transport Links
  let interSystemLinkCount = 0;
  recommendedPlanets.forEach(strat => {
    if (!strat.isAssemblyHub && strat.planetName !== "Trade Authority Vendor") {
      const linkType = strat.system === hubSystem ? 'Local' : 'Inter-System';
      if (linkType === 'Inter-System') interSystemLinkCount++;
      
      const cargo = [...strat.resourcesFound, ...(strat.manufacturedItems || [])];
      
      strat.links.push({
        target: hubName,
        type: linkType,
        cargo: cargo,
        direction: 'Outgoing'
      });
      strat.linkCount++;

      if (assemblyHubStrategy) {
        assemblyHubStrategy.links.push({
          target: strat.planetName,
          type: linkType,
          cargo: cargo,
          direction: 'Incoming'
        });
        assemblyHubStrategy.linkCount++;
      }
    }
  });

  const efficiencyScore = Math.max(5, 100 - (recommendedPlanets.length * 5) - (interSystemLinkCount * 10));

  // Refine summary message based on link limits
  let linkStatusMsg = "Logistical load is nominal.";
  if (assemblyHubStrategy) {
    if (assemblyHubStrategy.linkCount > 6) {
      linkStatusMsg = "Warning: Hub link count exceeds maximum possible capacity (6).";
    } else if (assemblyHubStrategy.linkCount > 3) {
      linkStatusMsg = `Route requires Outpost Management Skill (Rank 1+) to support ${assemblyHubStrategy.linkCount} links at ${hubName}.`;
    }
  }

  return {
    itemNames,
    totalResourcesRequired: Object.entries(rawTotals).map(([name, amount]) => ({ name, amount })),
    recommendedPlanets,
    manufacturingNodes,
    primaryAssemblyHub: hubName,
    efficiencyScore: Math.min(100, efficiencyScore),
    logisticalSummary: `Primary Hub: ${hubName}. ${interSystemLinkCount} Inter-System link(s) established. ${linkStatusMsg}`
  };
};
