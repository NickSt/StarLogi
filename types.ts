
export interface Resource {
  name: string;
  category: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Exotic' | 'Unique';
}

export interface TransitLink {
  target: string;
  type: 'Local' | 'Inter-System';
  cargo: string[];
  direction: 'Incoming' | 'Outgoing';
}

export interface PlanetStrategy {
  planetName: string;
  system: string;
  resourcesFound: string[];
  notes: string;
  isManufacturingSite?: boolean;
  isAssemblyHub?: boolean;
  manufacturedItems?: string[];
  links: TransitLink[];
  linkCount: number;
}

export interface ManufacturingSite {
  planetName: string;
  itemName: string;
  components: string[];
}

export interface ConstructionAnalysis {
  itemNames: string[];
  totalResourcesRequired: { name: string; amount: number }[];
  recommendedPlanets: PlanetStrategy[];
  manufacturingNodes: ManufacturingSite[];
  primaryAssemblyHub: string;
  efficiencyScore: number;
  logisticalSummary: string;
}
