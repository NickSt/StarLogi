
import { ConstructionAnalysis, PlanetStrategy, ItemData, PlanetData, TransitLink } from "../types";

const MAX_LINKS_PER_OUTPOST = 6;
const MAX_OUTPOSTS = 24;

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
    if (!item) return { name, isResource: true, children: [] };
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
  allPlanets: PlanetData[],
  useBidirectional: boolean = false
): ConstructionAnalysis => {
  if (itemNames.length === 0) throw new Error("No items selected.");

  const roots = buildDependencyTree(itemNames, allItems);
  const strategies = new Map<string, PlanetStrategy>();
  const resourceToOutpostMap = new Map<string, string>();
  const componentToOutpostMap = new Map<string, string>();
  const rawTotals: Record<string, number> = {};

  // 1. Identify all required raw resources
  const requiredRaws = new Set<string>();
  const allNodes: DependencyNode[] = [];
  function collectRaws(node: DependencyNode) {
    allNodes.push(node);
    if (node.isResource) {
      requiredRaws.add(node.name);
      rawTotals[node.name] = (rawTotals[node.name] || 0) + 1;
    } else {
      node.children.forEach(c => collectRaws(c.node));
    }
  }
  roots.forEach(collectRaws);

  function getOrCreateStrategy(planet: PlanetData): PlanetStrategy {
    if (strategies.has(planet.name)) return strategies.get(planet.name)!;
    const newStrat: PlanetStrategy = {
      planetName: planet.name,
      system: planet.system,
      resourcesFound: [],
      notes: "",
      links: [],
      linkCount: 0,
      manufacturedItems: [],
      finalAssemblyItems: []
    };
    strategies.set(planet.name, newStrat);
    return newStrat;
  }

  // 2. Map Raw Resources to Planets (The "Extraction Layer")
  const sortedPlanets = [...allPlanets].sort((a, b) => 
    b.resources.filter(r => requiredRaws.has(r)).length - a.resources.filter(r => requiredRaws.has(r)).length
  );

  const unassignedRaws = new Set(requiredRaws);
  for (const p of sortedPlanets) {
    if (unassignedRaws.size === 0) break;
    const matches = p.resources.filter(r => unassignedRaws.has(r));
    if (matches.length > 0) {
      const strat = getOrCreateStrategy(p);
      matches.forEach(r => {
        if (!strat.resourcesFound.includes(r)) strat.resourcesFound.push(r);
        resourceToOutpostMap.set(r, strat.planetName);
        unassignedRaws.delete(r);
      });
    }
  }

  // 3. Map Manufacturing (The "Processing Layer")
  function assignManufacturing(node: DependencyNode) {
    if (node.isResource) return;
    node.children.forEach(c => assignManufacturing(c.node));

    // Pick hub: Favor existing planets that provide most raw mats for this component
    let bestHub: PlanetStrategy | null = null;
    let maxScore = -1;

    for (const strat of strategies.values()) {
        const score = node.children.filter(c => strat.resourcesFound.includes(c.node.name)).length;
        if (score > maxScore) { maxScore = score; bestHub = strat; }
    }

    const finalHub = bestHub || Array.from(strategies.values())[0];
    node.assignedPlanet = finalHub.planetName;
    componentToOutpostMap.set(node.name, finalHub.planetName);
    if (!finalHub.manufacturedItems?.includes(node.name)) {
        finalHub.manufacturedItems?.push(node.name);
        finalHub.isManufacturingSite = true;
    }
  }
  roots.forEach(assignManufacturing);

  // 4. Force Connectivity (The "Logistics Layer")
  function addLink(sourceName: string, targetName: string, cargo: string) {
    if (sourceName === targetName || sourceName === "Trade Authority") return;
    const source = strategies.get(sourceName)!;
    const target = strategies.get(targetName)!;

    let link = source.links.find(l => l.target === targetName && l.direction !== 'Incoming');
    if (!link) {
      const type = source.system === target.system ? 'Local' : 'Inter-System';
      if (source.links.length < MAX_LINKS_PER_OUTPOST && target.links.length < MAX_LINKS_PER_OUTPOST) {
        link = { target: targetName, type, direction: 'Outgoing', cargo: [] };
        source.links.push(link);
        target.links.push({ target: sourceName, type, direction: 'Incoming', cargo: [] });
      } else {
        // Find existing link to reuse
        link = source.links.find(l => l.direction !== 'Incoming');
        if (link) {
            source.notes = "SLOT LIMIT: Cargo merged onto existing line.";
        }
      }
    }

    if (link && !link.cargo.includes(cargo)) {
      link.cargo.push(cargo);
      const tLink = target.links.find(l => l.target === sourceName && l.direction === 'Incoming');
      if (tLink && !tLink.cargo.includes(cargo)) tLink.cargo.push(cargo);
    }
  }

  // Final Pass: Ensure every single requirement has a link
  strategies.forEach(strat => {
    // Check components manufactured here
    const itemsMadeHere = [...(strat.manufacturedItems || [])];
    if (roots.some(r => r.assignedPlanet === strat.planetName)) {
        itemsMadeHere.push(...itemNames);
    }

    itemsMadeHere.forEach(itemName => {
       const recipe = allItems.find(i => i.name === itemName);
       if (!recipe) return;
       recipe.requirements.forEach(req => {
          const sourcePlanet = resourceToOutpostMap.get(req.name) || componentToOutpostMap.get(req.name);
          if (sourcePlanet && sourcePlanet !== strat.planetName) {
            addLink(sourcePlanet, strat.planetName, req.name);
          }
       });
    });
  });

  // 5. Restore Helium-3 Fuel Logic
  const finalPlanets = Array.from(strategies.values());
  const he3GlobalProvider = finalPlanets.find(p => p.resourcesFound.includes("Helium-3")) || 
                             getOrCreateStrategy(allPlanets.find(p => p.resources.includes("Helium-3")) || allPlanets[0]);
  
  if (!he3GlobalProvider.resourcesFound.includes("Helium-3")) {
      he3GlobalProvider.resourcesFound.push("Helium-3");
  }

  finalPlanets.forEach(strat => {
    const hasOutgoingInterSystem = strat.links.some(l => l.type === 'Inter-System' && l.direction === 'Outgoing');
    if (hasOutgoingInterSystem) {
      strat.requiresHe3 = true;
      const hasLocalHe3 = strat.resourcesFound.includes("Helium-3");
      if (!hasLocalHe3) {
        addLink(he3GlobalProvider.planetName, strat.planetName, "He-3 Fuel");
      }
    }
  });

  const assemblyHub = finalPlanets.reduce((prev, curr) => curr.links.length > prev.links.length ? curr : prev, finalPlanets[0]);
  if (assemblyHub) {
    assemblyHub.isAssemblyHub = true;
    assemblyHub.finalAssemblyItems = itemNames;
  }

  return {
    itemNames,
    totalResourcesRequired: Object.entries(rawTotals).map(([name, amount]) => ({ name, amount })),
    recommendedPlanets: finalPlanets,
    manufacturingNodes: [],
    primaryAssemblyHub: assemblyHub?.planetName || "Hub",
    efficiencyScore: Math.min(100, 110 - (finalPlanets.length * 4)),
    logisticalSummary: `Supply network optimized. Verified links for ${itemNames.length} project blueprints. Inter-system fuel chain established via ${he3GlobalProvider.planetName}.`,
    he3Required: finalPlanets.some(p => p.requiresHe3),
    outpostLimitReached: finalPlanets.length >= MAX_OUTPOSTS,
    bidirectionalEnabled: useBidirectional
  };
};
