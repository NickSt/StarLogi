
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

// A comprehensive selection of constructible items including the end-game Vytinium Fuel Rod hierarchy
export const CONSTRUCTIBLE_ITEMS: ItemData[] = [
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
    name: "Nuclear Fuel Rod",
    requirements: [
      { name: "Semimetal Wafer", amount: "1" },
      { name: "Uranium", amount: "2" },
      { name: "Solvent", amount: "1" }
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
    name: "Semimetal Wafer",
    requirements: [
      { name: "Antimony", amount: "1" },
      { name: "Gold", amount: "1" }
    ]
  },
  {
    name: "Advanced Reactor",
    requirements: [
      { name: "Mag-Pressure Tank", amount: "2" },
      { name: "Isocentered Magnet", amount: "4" },
      { name: "Tau Grade Rheostat", amount: "3" },
      { name: "Europium", amount: "2" }
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
    name: "Substrate Molecule Sieve",
    requirements: [
      { name: "Ionic Liquids", amount: "2" },
      { name: "Molecular Sieve", amount: "1" },
      { name: "Biosuppressant", amount: "1" }
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
    name: "Isocentered Magnet",
    requirements: [
      { name: "Iron", amount: "1" },
      { name: "Nickel", amount: "1" }
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
    name: "Tau Grade Rheostat",
    requirements: [
      { name: "Copper", amount: "1" },
      { name: "Beryllium", amount: "1" }
    ]
  },
  {
    name: "Adaptive Frame",
    requirements: [
      { name: "Iron", amount: "1" },
      { name: "Aluminum", amount: "1" }
    ]
  }
];

// Resources map for calculation and UI badges
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
  "Vytinium": ["Vy"]
};

// Expanded planetary database to include locations for high-tier exotic resources
export const PLANETS: PlanetData[] = [
  { name: "Decaran VII-b", system: "Decaran", resources: ["Vytinium", "Uranium", "Lead"] },
  { name: "Schrodinger III", system: "Schrodinger", resources: ["Indicite", "Cesium", "Solvent"] },
  { name: "Linnaeus IV-b", system: "Linnaeus", resources: ["Iron", "Aluminum", "Beryllium", "Europium"] },
  { name: "Hui II", system: "Hui", resources: ["Nickel", "Cobalt", "Lead", "Palladium"] },
  { name: "Maheo I", system: "Maheo", resources: ["Copper", "Iron", "Nickel"] },
  { name: "Tau Ceti VIII-b", system: "Tau Ceti", resources: ["Aluminum", "Iron", "Beryllium"] },
  { name: "Zamka", system: "Alpha Centauri", resources: ["Nickel", "Iron", "Cobalt", "Copper", "Antimony"] },
  { name: "Andraphon", system: "Narion", resources: ["Iron", "Aluminum", "Beryllium", "Europium"] },
  { name: "Kreet", system: "Narion", resources: ["Iron", "Lead", "Silver"] },
  { name: "Sumati", system: "Narion", resources: ["Lead", "Copper", "Fluorine", "Antimony"] },
  { name: "Washakie", system: "Cheyenne", resources: ["Lead", "Silver", "Neon", "Uranium"] },
  { name: "Montara Luna", system: "Cheyenne", resources: ["Aluminum", "Nickel", "Cobalt"] },
  { name: "Guniibuu II", system: "Guniibuu", resources: ["Aluminum", "Beryllium", "Gold"] },
  { name: "Nesoi", system: "Olympus", resources: ["Iron", "Uranium", "Argon"] },
  { name: "Tidacha I", system: "Tidacha", resources: ["Ionic Liquids", "Biosuppressant"] },
  { name: "Jaffa IV", system: "Jaffa", resources: ["Gold", "Copper", "Lead"] }
];
