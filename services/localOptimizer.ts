
import { ConstructionAnalysis, PlanetStrategy, ManufacturingSite, TransitLink } from "../types";
import { CONSTRUCTIBLE_ITEMS, PLANETS, ItemData, PlanetData } from "../data/gameData";

function aggregateRequirements(itemNames: string[]): Record<string, number> {
  const totals: Record<string, number> = {};

  function processItem(name: string, multiplier: number) {
    const item = CONSTRUCTIBLE_ITEMS.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) {
      totals[name] = (totals[name] || 0) + multiplier;
      return;
    }
    for (const req of item.requirements) {
      const amount = parseInt(req.amount) || 1;
      const subItem = CONSTRUCTIBLE_ITEMS.find(i => i.name.toLowerCase() === req.name.toLowerCase());
      if (subItem) processItem(req.name, multiplier * amount);
      else totals[req.name] = (totals[req.name] || 0) + (multiplier * amount);
    }
  }

  itemNames.forEach(name => processItem(name, 1));
  return totals;
}

function canManufacture(planetResources: string[], itemName: string): string[] | null {
  const item = CONSTRUCTIBLE_ITEMS.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (!item) return null;
  const rawReqs = Object.keys(aggregateRequirements([itemName]));
  const missing = rawReqs.filter(r => !planetResources.includes(r));
  return missing.length === 0 ? rawReqs : null;
}

export const getLocalConstructionStrategy = (itemNames: string[]): ConstructionAnalysis => {
  if (itemNames.length === 0) throw new Error("No items selected.");

  // Phase 1: Initial Requirement Aggregation
  const aggregatedRaw = aggregateRequirements(itemNames);
  let rawResourcesNeeded = Object.keys(aggregatedRaw);
  
  // Phase 2: Greedy Planetary Selection
  let remainingResources = [...rawResourcesNeeded];
  const recommendedPlanets: PlanetStrategy[] = [];

  while (remainingResources.length > 0) {
    let bestPlanet: PlanetData | null = null;
    let maxCoverage: string[] = [];
    for (const planet of PLANETS) {
      const coverage = planet.resources.filter(r => remainingResources.includes(r));
      if (coverage.length > maxCoverage.length) {
        maxCoverage = coverage;
        bestPlanet = planet;
      }
    }
    if (!bestPlanet || maxCoverage.length === 0) {
      const missing = remainingResources[0];
      recommendedPlanets.push({
        planetName: "GalBank / Trade Authority",
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

  // Phase 3: Assembly Hub Determination
  const assemblyHubStrategy = recommendedPlanets.reduce((prev, current) => 
    (current.resourcesFound.length > prev.resourcesFound.length) ? current : prev
  );
  assemblyHubStrategy.isAssemblyHub = true;
  const hubName = assemblyHubStrategy.planetName;
  const hubSystem = assemblyHubStrategy.system;

  // Phase 4: Manufacturing and Link Generation
  const manufacturingNodes: ManufacturingSite[] = [];
  const intermediateItems = CONSTRUCTIBLE_ITEMS.filter(item => !itemNames.includes(item.name));
  let interSystemLinkCount = 0;

  recommendedPlanets.forEach(strat => {
    const planetData = PLANETS.find(p => p.name === strat.planetName);
    if (!planetData) return;
    intermediateItems.forEach(item => {
      const components = canManufacture(planetData.resources, item.name);
      if (components) {
        manufacturingNodes.push({ planetName: strat.planetName, itemName: item.name, components });
        strat.isManufacturingSite = true;
        strat.manufacturedItems = [...(strat.manufacturedItems || []), item.name];
      }
    });

    if (!strat.isAssemblyHub && strat.planetName !== "GalBank / Trade Authority") {
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

      assemblyHubStrategy.links.push({
        target: strat.planetName,
        type: linkType,
        cargo: cargo,
        direction: 'Incoming'
      });
      assemblyHubStrategy.linkCount++;
    }
  });

  // Phase 5: Helium-3 Logistics Integration
  // In Starfield, each Inter-System Cargo Link consumes 5 He-3 per "cycle"
  if (interSystemLinkCount > 0) {
    const he3Required = interSystemLinkCount * 5;
    aggregatedRaw["Helium-3"] = (aggregatedRaw["Helium-3"] || 0) + he3Required;
    
    // Check if any recommended planet provides Helium-3
    const hasHe3InNetwork = recommendedPlanets.some(p => p.resourcesFound.includes("Helium-3"));
    
    if (!hasHe3InNetwork) {
      // Find a planet that has Helium-3 to add to the network
      const he3Planet = PLANETS.find(p => p.resources.includes("Helium-3"));
      if (he3Planet) {
        recommendedPlanets.push({
          planetName: he3Planet.name,
          system: he3Planet.system,
          resourcesFound: ["Helium-3"],
          notes: "Essential Helium-3 source for Inter-System transit.",
          links: [{
            target: hubName,
            type: he3Planet.system === hubSystem ? 'Local' : 'Inter-System',
            cargo: ["Helium-3"],
            direction: 'Outgoing'
          }],
          linkCount: 1
        });
        assemblyHubStrategy.links.push({
          target: he3Planet.name,
          type: he3Planet.system === hubSystem ? 'Local' : 'Inter-System',
          cargo: ["Helium-3"],
          direction: 'Incoming'
        });
        assemblyHubStrategy.linkCount++;
      } else {
        aggregatedRaw["Helium-3"] = (aggregatedRaw["Helium-3"] || 0) + he3Required;
      }
    }
  }

  const efficiencyScore = Math.max(5, 100 - (recommendedPlanets.length * 8) - (assemblyHubStrategy.linkCount > 3 ? 15 : 0));

  return {
    itemNames,
    totalResourcesRequired: Object.entries(aggregatedRaw).map(([name, amount]) => ({ name, amount })),
    recommendedPlanets,
    manufacturingNodes,
    primaryAssemblyHub: hubName,
    efficiencyScore: Math.min(100, efficiencyScore),
    logisticalSummary: `Primary Hub: ${hubName}. ${interSystemLinkCount} Inter-System link(s) established, requiring Helium-3 fuel. ${assemblyHubStrategy.linkCount > 3 ? "WARNING: Hub exceeds base cargo link limit (3)." : "Logistical load is nominal."}`
  };
};
