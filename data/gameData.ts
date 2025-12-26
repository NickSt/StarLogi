
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

/**
 * Comprehensive Starfield Manufactured Goods Database
 * Organized by Tier (Basic to Unique/Tier 4)
 * Based on Industrial Workbench recipes.
 */
export const CONSTRUCTIBLE_ITEMS: ItemData[] = [
  // --- TIER 4 (UNIQUE / MASTER) ---
  {
    name: "Vytinium Fuel Rod",
    requirements: [
      { name: "Indicite Wafer", amount: "1" },
      { name: "Vytinium", amount: "1" },
      { name: "Nuclear Fuel Rod", amount: "1" },
      { name: "Solvent", amount: "2" }
    ]
  },
  {
    name: "Aldumite Drilling Rig",
    requirements: [
      { name: "Aldumite", amount: "1" },
      { name: "Cesium", amount: "2" },
      { name: "Drilling Rig", amount: "1" },
      { name: "Microsecond Regulator", amount: "1" }
    ]
  },
  {
    name: "Indicite Wafer",
    requirements: [
      { name: "Indicite", amount: "1" },
      { name: "Cesium", amount: "2" },
      { name: "Solvent", amount: "2" },
      { name: "Semimetal Wafer", amount: "1" }
    ]
  },
  {
    name: "Substrate Molecule Sieve",
    requirements: [
      { name: "Ionic Liquids", amount: "2" },
      { name: "Molecular Sieve", amount: "1" },
      { name: "Biosuppressant", amount: "1" }
    ]
  },
  {
    name: "Nuclear Fuel Rod",
    requirements: [
      { name: "Semimetal Wafer", amount: "1" },
      { name: "Uranium", amount: "2" },
      { name: "Solvent", amount: "1" }
    ]
  },

  // --- TIER 3 (EXOTIC / ADVANCED) ---
  {
    name: "Positron Battery",
    requirements: [
      { name: "Antimony", amount: "1" },
      { name: "Lead", amount: "2" },
      { name: "Mercury", amount: "1" }
    ]
  },
  {
    name: "Power Circuit",
    requirements: [
      { name: "Palladium", amount: "2" },
      { name: "Cobalt", amount: "1" },
      { name: "Lead", amount: "1" }
    ]
  },
  {
    name: "Supercooled Magnet",
    requirements: [
      { name: "Isocentered Magnet", amount: "1" },
      { name: "Neodymium", amount: "1" }
    ]
  },
  {
    name: "Zero-G Gimbal",
    requirements: [
      { name: "Aluminum", amount: "2" },
      { name: "Nickel", amount: "1" },
      { name: "Iron", amount: "1" }
    ]
  },
  {
    name: "Paramagnon Conductor",
    requirements: [
      { name: "Neodymium", amount: "1" },
      { name: "Gold", amount: "1" }
    ]
  },
  {
    name: "Semimetal Wafer",
    requirements: [
      { name: "Antimony", amount: "1" },
      { name: "Gold", amount: "1" }
    ]
  },

  // --- TIER 2 (UNCOMMON / REFINED) ---
  {
    name: "Drilling Rig",
    requirements: [
      { name: "Reactive Gauge", amount: "1" },
      { name: "Milling Drum", amount: "1" }
    ]
  },
  {
    name: "Comm Relay",
    requirements: [
      { name: "Isocentered Magnet", amount: "1" },
      { name: "Tau Grade Rheostat", amount: "1" }
    ]
  },
  {
    name: "Mag-Pressure Tank",
    requirements: [
      { name: "Aluminum", amount: "1" },
      { name: "Nickel", amount: "1" }
    ]
  },
  {
    name: "Microsecond Regulator",
    requirements: [
      { name: "Aluminum", amount: "1" },
      { name: "Copper", amount: "1" },
      { name: "Beryllium", amount: "1" }
    ]
  },
  {
    name: "Austenitic Manifold",
    requirements: [
      { name: "Nickel", amount: "2" },
      { name: "Iron", amount: "1" },
      { name: "Copper", amount: "1" }
    ]
  },
  {
    name: "Milling Drum",
    requirements: [
      { name: "Aluminum", amount: "2" },
      { name: "Iron", amount: "1" },
      { name: "Nickel", amount: "1" }
    ]
  },
  {
    name: "Molecular Sieve",
    requirements: [
      { name: "Mag-Pressure Tank", amount: "1" },
      { name: "Ionic Liquids", amount: "2" }
    ]
  },
  {
    name: "Monoclinic Lattice",
    requirements: [
      { name: "Lithium", amount: "2" },
      { name: "Cesium", amount: "1" }
    ]
  },

  // --- TIER 1 (BASIC) ---
  {
    name: "Adaptive Frame",
    requirements: [
      { name: "Iron", amount: "1" },
      { name: "Aluminum", amount: "1" }
    ]
  },
  {
    name: "Isocentered Magnet",
    requirements: [
      { name: "Iron", amount: "1" },
      { name: "Nickel", amount: "1" }
    ]
  },
  {
    name: "Reactive Gauge",
    requirements: [
      { name: "Aluminum", amount: "1" },
      { name: "Copper", amount: "1" }
    ]
  },
  {
    name: "Tau Grade Rheostat",
    requirements: [
      { name: "Copper", amount: "1" },
      { name: "Beryllium", amount: "1" }
    ]
  }
];

export const RESOURCE_MAP: Record<string, string[]> = {
  "Iron": ["Fe"],
  "Aluminum": ["Al"],
  "Nickel": ["Ni"],
  "Copper": ["Cu"],
  "Beryllium": ["Be"],
  "Cobalt": ["Co"],
  "Palladium": ["Pd"],
  "Lead": ["Pb"],
  "Europium": ["Eu"],
  "Indicite": ["In"],
  "Cesium": ["Cs"],
  "Solvent": ["Sol"],
  "Ionic Liquids": ["IL"],
  "Biosuppressant": ["Bio"],
  "Antimony": ["Sb"],
  "Gold": ["Au"],
  "Uranium": ["U"],
  "Vytinium": ["Vy"],
  "Helium-3": ["He-3"],
  "Mercury": ["Hg"],
  "Neodymium": ["Nd"],
  "Lithium": ["Li"],
  "Aldumite": ["Ad"]
};

export const PLANETS: PlanetData[] = [
  { name: "Decaran VII-b", system: "Decaran", resources: ["Vytinium", "Uranium", "Lead", "Helium-3"] },
  { name: "Schrodinger III", system: "Schrodinger", resources: ["Indicite", "Cesium", "Solvent", "Iron"] },
  { name: "Linnaeus IV-b", system: "Linnaeus", resources: ["Iron", "Aluminum", "Beryllium", "Europium", "Helium-3"] },
  { name: "Hui II", system: "Hui", resources: ["Nickel", "Cobalt", "Lead", "Palladium", "Helium-3"] },
  { name: "Maheo I", system: "Maheo", resources: ["Copper", "Iron", "Nickel", "Helium-3", "Neodymium"] },
  { name: "Tau Ceti VIII-b", system: "Tau Ceti", resources: ["Aluminum", "Iron", "Beryllium", "Argon"] },
  { name: "Zamka", system: "Alpha Centauri", resources: ["Nickel", "Iron", "Cobalt", "Copper", "Antimony", "Helium-3"] },
  { name: "Andraphon", system: "Narion", resources: ["Iron", "Aluminum", "Beryllium", "Europium", "Helium-3"] },
  { name: "Kreet", system: "Narion", resources: ["Iron", "Lead", "Silver", "Helium-3", "Lithium"] },
  { name: "Sumati", system: "Narion", resources: ["Lead", "Copper", "Fluorine", "Antimony", "Mercury"] },
  { name: "Washakie", system: "Cheyenne", resources: ["Lead", "Silver", "Neon", "Uranium"] },
  { name: "Montara Luna", system: "Cheyenne", resources: ["Aluminum", "Nickel", "Cobalt"] },
  { name: "Guniibuu II", system: "Guniibuu", resources: ["Aluminum", "Beryllium", "Gold"] },
  { name: "Nesoi", system: "Olympus", resources: ["Iron", "Uranium", "Argon"] },
  { name: "Tidacha I", system: "Tidacha", resources: ["Ionic Liquids", "Biosuppressant", "Copper"] },
  { name: "Jaffa IV", system: "Jaffa", resources: ["Gold", "Copper", "Lead", "Lithium"] },
  { name: "Schrodinger VIII-a", system: "Schrodinger", resources: ["Aldumite", "Iron", "Uranium"] }
];
