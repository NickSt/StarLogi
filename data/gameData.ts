
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
 * Verified against Industrial Workbench Tier 1-4 recipes.
 */
export const CONSTRUCTIBLE_ITEMS: ItemData[] = [
  // --- TIER 4 (UNIQUE / EXOTIC) ---
  {
    name: "Vytinium Fuel Rod",
    requirements: [
      { name: "Indicite Wafer", amount: "1" },
      { name: "Vytinium", amount: "2" },
      { name: "Nuclear Fuel Rod", amount: "1" },
      { name: "Solvent", amount: "2" }
    ]
  },
  {
    name: "Aldumite Drilling Rig",
    requirements: [
      { name: "Aldumite", amount: "2" },
      { name: "Cesium", amount: "2" },
      { name: "Drilling Rig", amount: "1" },
      { name: "Microsecond Regulator", amount: "1" }
    ]
  },
  {
    name: "Indicite Wafer",
    requirements: [
      { name: "Indicite", amount: "2" },
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
      { name: "Biosuppressant", amount: "2" }
    ]
  },
  {
    name: "Nuclear Fuel Rod",
    requirements: [
      { name: "Semimetal Wafer", amount: "1" },
      { name: "Uranium", amount: "2" },
      { name: "Solvent", amount: "2" }
    ]
  },
  {
    name: "Rothicite Magnet",
    requirements: [
      { name: "Rothicite", amount: "2" },
      { name: "Neodymium", amount: "2" },
      { name: "Isocentered Magnet", amount: "1" }
    ]
  },

  // --- TIER 3 (RARE) ---
  {
    name: "Positron Battery",
    requirements: [
      { name: "Antimony", amount: "2" },
      { name: "Lead", amount: "2" },
      { name: "Mercury", amount: "2" }
    ]
  },
  {
    name: "Power Circuit",
    requirements: [
      { name: "Palladium", amount: "4" },
      { name: "Cobalt", amount: "2" },
      { name: "Lead", amount: "2" }
    ]
  },
  {
    name: "Supercooled Magnet",
    requirements: [
      { name: "Isocentered Magnet", amount: "1" },
      { name: "Neodymium", amount: "3" },
      { name: "Lithium", amount: "2" }
    ]
  },
  {
    name: "Zero-G Gimbal",
    requirements: [
      { name: "Aluminum", amount: "2" },
      { name: "Nickel", amount: "2" },
      { name: "Iron", amount: "2" },
      { name: "Isotopic Coolant", amount: "1" }
    ]
  },
  {
    name: "Paramagnon Conductor",
    requirements: [
      { name: "Neodymium", amount: "3" },
      { name: "Gold", amount: "2" }
    ]
  },
  {
    name: "Semimetal Wafer",
    requirements: [
      { name: "Antimony", amount: "2" },
      { name: "Gold", amount: "2" },
      { name: "Copper", amount: "2" }
    ]
  },
  {
    name: "Microsecond Regulator",
    requirements: [
      { name: "Tau Grade Rheostat", amount: "1" },
      { name: "Isotopic Coolant", amount: "1" },
      { name: "Lithium", amount: "2" }
    ]
  },

  // --- TIER 2 (UNCOMMON) ---
  {
    name: "Drilling Rig",
    requirements: [
      { name: "Reactive Gauge", amount: "1" },
      { name: "Milling Drum", amount: "1" },
      { name: "Lubricant", amount: "2" }
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
      { name: "Aluminum", amount: "2" },
      { name: "Nickel", amount: "2" }
    ]
  },
  {
    name: "Austenitic Manifold",
    requirements: [
      { name: "Nickel", amount: "2" },
      { name: "Iron", amount: "2" },
      { name: "Copper", amount: "2" }
    ]
  },
  {
    name: "Milling Drum",
    requirements: [
      { name: "Aluminum", amount: "2" },
      { name: "Iron", amount: "2" },
      { name: "Sealant", amount: "2" }
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
      { name: "Cesium", amount: "2" }
    ]
  },
  {
    name: "Isotopic Coolant",
    requirements: [
      { name: "Ionic Liquids", amount: "1" },
      { name: "Tetrafluorides", amount: "1" }
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
  "Aldumite": ["Ad"],
  "Rothicite": ["Ro"],
  "Tetrafluorides": ["Tf"],
  "Sealant": ["Sea"],
  "Lubricant": ["Lub"],
  "Argon": ["Ar"],
  "Silver": ["Ag"],
  "Fluorine": ["F"],
  "Neon": ["Ne"],
  "Water": ["H2O"],
  "Alkanes": ["H-C"],
  "Chlorosilanes": ["SiH"],
  "Chlorine": ["Cl"],
  "Tantalum": ["Ta"],
  "Titanium": ["Ti"],
  "Tungsten": ["W"],
  "Vanadium": ["V"],
  "Dysprosium": ["Dy"],
  "Ytterbium": ["Yb"],
  "Platinum": ["Pt"],
  "Xenon": ["Xe"]
};

export const PLANETS: PlanetData[] = [
  // --- SOL SYSTEM ---
  { name: "Mercury", system: "Sol", resources: ["Helium-3", "Aluminum", "Neodymium"] },
  { name: "Venus", system: "Sol", resources: ["Nickel", "Cobalt", "Water", "Lead", "Dysprosium"] },
  { name: "Earth", system: "Sol", resources: ["Water", "Chlorine"] },
  { name: "Moon", system: "Sol", resources: ["Helium-3", "Iron"] },
  { name: "Mars", system: "Sol", resources: ["Water", "Chlorine", "Iron", "Lead"] },
  { name: "Phobos", system: "Sol", resources: ["Nickel", "Iron"] },
  { name: "Deimos", system: "Sol", resources: ["Aluminum", "Iron"] },
  { name: "Io", system: "Sol", resources: ["Helium-3", "Iron", "Chlorine"] },
  { name: "Europa", system: "Sol", resources: ["Water", "Chlorine"] },
  { name: "Ganymede", system: "Sol", resources: ["Water", "Chlorine"] },
  { name: "Callisto", system: "Sol", resources: ["Helium-3", "Iron"] },
  { name: "Titan", system: "Sol", resources: ["Water", "Lead", "Tungsten", "Titanium"] },
  { name: "Enceladus", system: "Sol", resources: ["Water", "Argon"] },
  { name: "Iapetus", system: "Sol", resources: ["Water", "Argon"] },
  { name: "Ariel", system: "Sol", resources: ["Water", "Copper"] },
  { name: "Titania", system: "Sol", resources: ["Water", "Copper", "Lead"] },
  { name: "Oberon", system: "Sol", resources: ["Water", "Nickel"] },
  { name: "Triton", system: "Sol", resources: ["Water", "Argon"] },
  { name: "Pluto", system: "Sol", resources: ["Water", "Lead", "Tungsten"] },
  { name: "Charon", system: "Sol", resources: ["Water", "Copper"] },

  // --- ALPHA CENTAURI ---
  { name: "Jemison", system: "Alpha Centauri", resources: ["Water", "Lead", "Argon", "Chlorine"] },
  { name: "Gagarin", system: "Alpha Centauri", resources: ["Water", "Lead", "Chlorine", "Sealant"] },
  { name: "Olivas", system: "Alpha Centauri", resources: ["Helium-3", "Hydrogen"] },
  { name: "Voss", system: "Alpha Centauri", resources: ["Water", "Nickel", "Cobalt", "Tungsten", "Uranium"] },
  { name: "Chawla", system: "Alpha Centauri", resources: ["Water", "Iron", "Lead"] },
  { name: "Zamka", system: "Alpha Centauri", resources: ["Water", "Helium-3", "Copper", "Nickel", "Iron", "Cobalt", "Vanadium"] },

  // --- NARION ---
  { name: "Anselon", system: "Narion", resources: ["Water", "Nickel", "Cobalt", "Lead"] },
  { name: "Kreet", system: "Narion", resources: ["Helium-3", "Iron", "Lead", "Silver", "Water", "Alkanes"] },
  { name: "Vectera", system: "Narion", resources: ["Water", "Iron", "Magnesium"] },
  { name: "Niira", system: "Narion", resources: ["Water", "Copper", "Nickel", "Iron", "Lead", "Fluorine", "Ionic Liquids"] },
  { name: "Magreth", system: "Narion", resources: ["Water", "Lead", "Silver", "Mercury"] },
  { name: "Sumati", system: "Narion", resources: ["Water", "Lead", "Copper", "Fluorine", "Antimony", "Tetrafluorides"] },
  { name: "Deepala", system: "Narion", resources: ["Helium-3", "Hydrogen"] },
  { name: "Grimsey", system: "Narion", resources: ["Water", "Iron", "Uranium"] },

  // --- CHEYENNE ---
  { name: "Akila", system: "Cheyenne", resources: ["Water", "Aluminum", "Nickel", "Cobalt", "Copper"] },
  { name: "Montara Luna", system: "Cheyenne", resources: ["Water", "Aluminum", "Nickel", "Cobalt", "Sealant"] },
  { name: "Washakie", system: "Cheyenne", resources: ["Water", "Argon", "Lead", "Silver", "Neon", "Uranium", "Benzene"] },
  { name: "Bindi", system: "Cheyenne", resources: ["Water", "Nickel", "Cobalt", "Tungsten"] },
  { name: "Codos", system: "Cheyenne", resources: ["Water", "Aluminum", "Iron", "Chlorine", "Sealant"] },
  { name: "Skink", system: "Cheyenne", resources: ["Nickel", "Copper", "Fluorine", "Ionic Liquids", "Mercury"] },
  { name: "Burrow", system: "Cheyenne", resources: ["Water", "Lead", "Silver"] },

  // --- VOLII ---
  { name: "Volii Alpha", system: "Volii", resources: ["Water", "Benzene"] },
  { name: "Volii Beta", system: "Volii", resources: ["Water", "Ionic Liquids"] },
  { name: "Volii Gamma", system: "Volii", resources: ["Water", "Copper", "Fluorine", "Antimony", "Ionic Liquids"] },
  { name: "Volii Delta", system: "Volii", resources: ["Nickel", "Cobalt"] },
  { name: "Volii Epsilon", system: "Volii", resources: ["Water", "Lead", "Chlorine", "Chlorosilanes"] },

  // --- SCHRODINGER (High Tier) ---
  { name: "Schrodinger I", system: "Schrodinger", resources: ["Nickel", "Iron", "Cobalt", "Uranium"] },
  { name: "Schrodinger II", system: "Schrodinger", resources: ["Water", "Copper", "Antimony", "Gold"] },
  { name: "Schrodinger III", system: "Schrodinger", resources: ["Water", "Copper", "Iron", "Argon", "Cesium", "Indicite", "Solvent"] },
  { name: "Schrodinger IV", system: "Schrodinger", resources: ["Water", "Aluminum", "Beryllium", "Neodymium"] },
  { name: "Schrodinger VI", system: "Schrodinger", resources: ["Nickel", "Cobalt"] },
  { name: "Schrodinger VII", system: "Schrodinger", resources: ["Water", "Lead", "Silver", "Mercury"] },
  { name: "Schrodinger VIII-a", system: "Schrodinger", resources: ["Water", "Iron", "Uranium", "Lithium", "Aldumite"] },

  // --- DECARAN (High Tier) ---
  { name: "Decaran I", system: "Decaran", resources: ["Nickel", "Cobalt"] },
  { name: "Decaran II", system: "Decaran", resources: ["Water", "Copper", "Fluorine", "Ionic Liquids", "Antimony"] },
  { name: "Decaran VII-b", system: "Decaran", resources: ["Water", "Lead", "Uranium", "Vytinium"] },

  // --- CARINAE ---
  { name: "Carinae III-a", system: "Carinae", resources: ["Iron", "Alkanes", "Rothicite", "Tantalum"] },

  // --- JAFFA ---
  { name: "Jaffa I", system: "Jaffa", resources: ["Helium-3", "Aluminum", "Neodymium"] },
  { name: "Jaffa II", system: "Jaffa", resources: ["Water", "Lead", "Antimony"] },
  { name: "Jaffa III", system: "Jaffa", resources: ["Water", "Copper", "Chlorine", "Fluorine", "Lithium"] },
  { name: "Jaffa IV", system: "Jaffa", resources: ["Water", "Copper", "Lead", "Gold", "Lithium"] },

  // --- OLYMPUS ---
  { name: "Nesoi", system: "Olympus", resources: ["Water", "Iron", "Uranium", "Argon", "Benzene", "Iridium", "Carboxylic Acids"] },
  { name: "Erebus", system: "Olympus", resources: ["Helium-3", "Aluminum", "Neodymium"] },
  { name: "Dionysus", system: "Olympus", resources: ["Water", "Lead", "Silver", "Benzene"] },

  // --- LINNAEUS ---
  { name: "Linnaeus I", system: "Linnaeus", resources: ["Helium-3", "Aluminum", "Beryllium"] },
  { name: "Linnaeus II", system: "Linnaeus", resources: ["Water", "Lead", "Silver", "Mercury"] },
  { name: "Linnaeus IV-b", system: "Linnaeus", resources: ["Water", "Helium-3", "Aluminum", "Iron", "Beryllium", "Europium"] },

  // --- HUI ---
  { name: "Hui II", system: "Hui", resources: ["Water", "Nickel", "Cobalt", "Lead", "Palladium"] },
  { name: "Hui III-a", system: "Hui", resources: ["Helium-3", "Aluminum", "Beryllium", "Barium"] },

  // --- BEL ---
  { name: "Bel I", system: "Bel", resources: ["Water", "Mercury", "Tetrafluorides"] },
  { name: "Bel II", system: "Bel", resources: ["Nickel", "Cobalt"] },

  // --- TIDACHA ---
  { name: "Tidacha I", system: "Tidacha", resources: ["Water", "Copper", "Ionic Liquids", "Biosuppressant"] },

  // --- MAHEO ---
  { name: "Maheo I", system: "Maheo", resources: ["Water", "Copper", "Iron", "Nickel", "Helium-3", "Neodymium", "Alkanes"] },
  { name: "Maheo II", system: "Maheo", resources: ["Water", "Lead", "Silver", "Mercury"] },

  // --- GUNITIBUU ---
  { name: "Guniibuu II", system: "Guniibuu", resources: ["Water", "Aluminum", "Beryllium", "Gold"] },
  { name: "Guniibuu VI-d", system: "Guniibuu", resources: ["Nickel", "Iron", "Cobalt", "Platinum"] },

  // --- PORRIMA ---
  { name: "Porrima I", system: "Porrima", resources: ["Helium-3", "Aluminum", "Neodymium"] },
  { name: "Porrima II", system: "Porrima", resources: ["Water", "Copper", "Fluorine", "Lithium"] },
  { name: "Porrima III", system: "Porrima", resources: ["Water", "Copper", "Gold", "Antimony"] },
  { name: "Porrima IV-c", system: "Porrima", resources: ["Nickel", "Iron", "Uranium", "Plutonium"] },
  { name: "Porrima V-a", system: "Porrima", resources: ["Water", "Argon", "Benzene", "Neon"] },

  // --- IXILL ---
  { name: "Ixill II", system: "Ixill", resources: ["Water", "Copper", "Nickel", "Iron", "Fluorine"] },
  { name: "Ixill III", system: "Ixill", resources: ["Water", "Lead", "Silver", "Argon"] },

  // --- FREYA ---
  { name: "Freya III", system: "Freya", resources: ["Water", "Lead", "Silver", "Mercury"] },
  { name: "Freya IX-b", system: "Freya", resources: ["Nickel", "Iron", "Cobalt"] },

  // --- HAWKING ---
  { name: "Hawking I", system: "Hawking", resources: ["Nickel", "Iron", "Uranium"] },
  { name: "Hawking IV-a", system: "Hawking", resources: ["Water", "Copper", "Antimony", "Gold"] },

  // --- HUYGENS ---
  { name: "Huygens III", system: "Huygens", resources: ["Water", "Copper", "Lead", "Gold", "Antimony"] },
  { name: "Huygens VII-a", system: "Huygens", resources: ["Nickel", "Iron", "Cobalt"] },

  // --- MASADA ---
  { name: "Masada III", system: "Masada", resources: ["Water", "Copper", "Iron", "Lead", "Antimony", "Gold"] },

  // --- FERMI ---
  { name: "Fermi III", system: "Fermi", resources: ["Water", "Copper", "Fluorine", "Ionic Liquids"] },
  { name: "Fermi VII-a", system: "Fermi", resources: ["Nickel", "Iron", "Cobalt", "Palladium"] }
];
