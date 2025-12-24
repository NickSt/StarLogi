
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

  const aggregatedRaw = aggregateRequirements(itemNames);
  const rawResourcesNeeded = Object.keys(aggregatedRaw);
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

  const assemblyHubStrategy = recommendedPlanets.reduce((prev, current) => 
    (current.resourcesFound.length > prev.resourcesFound.length) ? current : prev
  );
  assemblyHubStrategy.isAssemblyHub = true;
  const hubName = assemblyHubStrategy.planetName;
  const hubSystem = assemblyHubStrategy.system;

  const manufacturingNodes: ManufacturingSite[] = [];
  const intermediateItems = CONSTRUCTIBLE_ITEMS.filter(item => !itemNames.includes(item.name));

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

    // Generate Links to Hub
    if (!strat.isAssemblyHub && strat.planetName !== "GalBank / Trade Authority") {
      const linkType = strat.system === hubSystem ? 'Local' : 'Inter-System';
      const cargo = [...strat.resourcesFound, ...(strat.manufacturedItems || [])];
      
      // Outgoing from source
      strat.links.push({
        target: hubName,
        type: linkType,
        cargo: cargo,
        direction: 'Outgoing'
      });
      strat.linkCount++;

      // Incoming to hub
      assemblyHubStrategy.links.push({
        target: strat.planetName,
        type: linkType,
        cargo: cargo,
        direction: 'Incoming'
      });
      assemblyHubStrategy.linkCount++;
    }
  });

  const efficiencyScore = Math.max(5, 100 - (recommendedPlanets.length * 8) - (assemblyHubStrategy.linkCount > 3 ? 15 : 0));

  return {
    itemNames,
    totalResourcesRequired: Object.entries(aggregatedRaw).map(([name, amount]) => ({ name, amount })),
    recommendedPlanets,
    manufacturingNodes,
    primaryAssemblyHub: hubName,
    efficiencyScore: Math.min(100, efficiencyScore),
    logisticalSummary: `Primary Hub: ${hubName}. Total Network Links: ${recommendedPlanets.reduce((acc, p) => acc + p.linkCount, 0) / 2}. ${assemblyHubStrategy.linkCount > 3 ? "WARNING: Hub exceeds base cargo link limit (3)." : "Hub is within standard logistical parameters."}`
  };
};
