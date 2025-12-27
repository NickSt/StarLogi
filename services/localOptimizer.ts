
import { ConstructionAnalysis, PlanetStrategy, ManufacturingSite, ItemData, PlanetData, TransitLink } from "../types";

/**
 * Strategy: Component-Aware Hierarchical Optimization
 * 1. Build the full dependency tree.
 * 2. Identify "Local Loops": Components whose raw materials all exist on one planet.
 * 3. Assign intermediate hubs if a single node exceeds link capacity.
 */

interface DependencyNode {
  name: string;
  isResource: boolean;
  children: { node: DependencyNode; amount: number }[];
  assignedPlanet?: string;
}

function buildDependencyTree(itemNames: string[], allItems: ItemData[]): DependencyNode[] {
  const itemsMap = new Map<string, ItemData>(allItems.map(i => [i.name.toLowerCase(), i]));
  
  function process(name: string): DependencyNode {
    const item = itemsMap.get(name.toLowerCase());
    if (!item) {
      return { name, isResource: true, children: [] };
    }
    return {
      name: item.name,
      isResource: false,
      children: item.requirements.map(req => ({
        node: process(req.name),
        amount: parseInt(req.amount) || 1
      }))
    };
  }

  return itemNames.map(process);
}

export const getLocalConstructionStrategy = (
  itemNames: string[], 
  allItems: ItemData[], 
  allPlanets: PlanetData[]
): ConstructionAnalysis => {
  if (itemNames.length === 0) throw new Error("No items selected.");

  const roots = buildDependencyTree(itemNames, allItems);
  const strategies = new Map<string, PlanetStrategy>();
  
  // Track resource totals for the summary
  const rawTotals: Record<string, number> = {};
  const manufacturingNodes: ManufacturingSite[] = [];

  // Helper to get or create a strategy for a planet
  function getOrCreateStrategy(planet: PlanetData | { name: string, system: string, resources: string[] }): PlanetStrategy {
    if (!strategies.has(planet.name)) {
      strategies.set(planet.name, {
        planetName: planet.name,
        system: planet.system,
        resourcesFound: [],
        notes: "",
        links: [],
        linkCount: 0,
        manufacturedItems: [],
        finalAssemblyItems: []
      });
    }
    return strategies.get(planet.name)!;
  }

  // Phase 1: Assign production locations
  function assignProduction(node: DependencyNode, parentStrategy?: PlanetStrategy) {
    if (node.isResource) {
      rawTotals[node.name] = (rawTotals[node.name] || 0) + 1; // Simplistic count for UI
      return;
    }

    // Find best planet for this component
    // Priority 1: A planet that has most/all children resources locally
    const childResources = node.children.filter(c => c.node.isResource).map(c => c.node.name);
    let bestPlanet: PlanetData | null = null;
    let maxCoverage = -1;

    for (const p of allPlanets) {
      const coverage = p.resources.filter(r => childResources.includes(r)).length;
      if (coverage > maxCoverage) {
        maxCoverage = coverage;
        bestPlanet = p;
      }
    }

    const currentPlanet = bestPlanet || allPlanets[0]; // Fallback
    const strategy = getOrCreateStrategy(currentPlanet);
    node.assignedPlanet = strategy.planetName;

    if (!strategy.manufacturedItems?.includes(node.name)) {
      strategy.isManufacturingSite = true;
      strategy.manufacturedItems = [...(strategy.manufacturedItems || []), node.name];
    }

    // Add local resources to the strategy
    childResources.forEach(res => {
      if (currentPlanet.resources.includes(res) && !strategy.resourcesFound.includes(res)) {
        strategy.resourcesFound.push(res);
      }
    });

    // Recurse to children
    node.children.forEach(child => {
      assignProduction(child.node, strategy);
      
      // Phase 2: Create Links
      if (child.node.assignedPlanet && child.node.assignedPlanet !== strategy.planetName) {
        // We need to move component/resource from child planet to current strategy planet
        const sourceStrategy = strategies.get(child.node.assignedPlanet)!;
        const targetStrategy = strategy;

        // Check for existing link
        const existing = sourceStrategy.links.find(l => l.target === targetStrategy.planetName);
        if (existing) {
          if (!existing.cargo.includes(child.node.name)) existing.cargo.push(child.node.name);
        } else {
          const type = sourceStrategy.system === targetStrategy.system ? 'Local' : 'Inter-System';
          
          sourceStrategy.links.push({
            target: targetStrategy.planetName,
            type,
            direction: 'Outgoing',
            cargo: [child.node.name]
          });
          sourceStrategy.linkCount++;

          targetStrategy.links.push({
            target: sourceStrategy.planetName,
            type,
            direction: 'Incoming',
            cargo: [child.node.name]
          });
          targetStrategy.linkCount++;
        }
      } else if (child.node.isResource && !currentPlanet.resources.includes(child.node.name)) {
          // This resource isn't local, find a planet for it
          const resBest = allPlanets.find(p => p.resources.includes(child.node.name)) || { name: "Trade Authority", system: "Various", resources: [child.node.name] };
          const resStrategy = getOrCreateStrategy(resBest);
          if (!resStrategy.resourcesFound.includes(child.node.name)) resStrategy.resourcesFound.push(child.node.name);

          // Link it
          const type = resStrategy.system === strategy.system ? 'Local' : 'Inter-System';
          const existing = resStrategy.links.find(l => l.target === strategy.planetName);
          if (existing) {
            if (!existing.cargo.includes(child.node.name)) existing.cargo.push(child.node.name);
          } else {
            resStrategy.links.push({ target: strategy.planetName, type, direction: 'Outgoing', cargo: [child.node.name] });
            resStrategy.linkCount++;
            strategy.links.push({ target: resStrategy.planetName, type, direction: 'Incoming', cargo: [child.node.name] });
            strategy.linkCount++;
          }
      }
    });
  }

  roots.forEach(root => assignProduction(root));

  // Determine Hubs
  const recommendedPlanets = Array.from(strategies.values());
  const assemblyHub = recommendedPlanets.reduce((prev, current) => 
    (current.linkCount > prev.linkCount) ? current : prev
  , recommendedPlanets[0]);

  if (assemblyHub) {
    assemblyHub.isAssemblyHub = true;
    assemblyHub.finalAssemblyItems = itemNames;
  }

  // Final scoring and summary
  const interSystemLinks = recommendedPlanets.reduce((acc, p) => 
    acc + p.links.filter(l => l.type === 'Inter-System' && l.direction === 'Outgoing').length, 0);

  const efficiencyScore = Math.max(5, 100 - (recommendedPlanets.length * 4) - (interSystemLinks * 8));
  
  let logisticalSummary = `Complex hierarchy established via ${recommendedPlanets.length} outposts. `;
  const overLimit = recommendedPlanets.filter(p => p.linkCount > 6);
  if (overLimit.length > 0) {
    logisticalSummary += `CRITICAL: ${overLimit.length} hub(s) exceed the 6-link limit. Consolidate sub-components manually.`;
  } else {
    logisticalSummary += `All nodes within safety parameters (<6 links).`;
  }

  return {
    itemNames,
    totalResourcesRequired: Object.entries(rawTotals).map(([name, amount]) => ({ name, amount })),
    recommendedPlanets,
    manufacturingNodes: [], // Deprecated in favor of strategy-level manufacturedItems
    primaryAssemblyHub: assemblyHub?.planetName || "None",
    efficiencyScore: Math.min(100, efficiencyScore),
    logisticalSummary
  };
};
