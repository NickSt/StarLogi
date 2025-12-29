
export interface Resource {
  name: string;
  category: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Exotic' | 'Unique';
}

export interface TransitLink {
  target: string;
  type: 'Local' | 'Inter-System';
  cargo: string[]; // Used for legacy/simple display
  direction: 'Incoming' | 'Outgoing' | 'Bidirectional';
  sentCargo?: string[]; // Used for bidirectional
  receivedCargo?: string[]; // Used for bidirectional
  isFueled?: boolean;
}

export interface PlanetStrategy {
  planetName: string;
  system: string;
  resourcesFound: string[];
  notes: string;
  isManufacturingSite?: boolean;
  isAssemblyHub?: boolean;
  manufacturedItems?: string[];
  finalAssemblyItems?: string[];
  links: TransitLink[];
  linkCount: number;
  requiresHe3?: boolean;
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
  he3Required: boolean;
  outpostLimitReached: boolean;
  bidirectionalEnabled: boolean;
}

// Data formats for the GitHub repo normalization
export interface ItemRequirement {
  name: string;
  amount: string;
}

export interface ItemData {
  name: string;
  requirements: ItemRequirement[];
}

export interface PlanetData {
  name: string;
  system: string;
  resources: string[];
}
