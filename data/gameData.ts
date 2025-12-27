
import { ItemData, PlanetData } from "../types";

export const CONSTRUCTIBLE_ITEMS: ItemData[] = [
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
  {
    name: "Supercooled Magnet",
    requirements: [
      { name: "Isocentered Magnet", amount: "1" },
      { name: "Neodymium", amount: "3" },
      { name: "Lithium", amount: "2" }
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
    name: "Drilling Rig",
    requirements: [
      { name: "Reactive Gauge", amount: "1" },
      { name: "Milling Drum", amount: "1" },
      { name: "Lubricant", amount: "2" }
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
  },
  {
    name: "Milling Drum",
    requirements: [
      { name: "Aluminum", amount: "2" },
      { name: "Iron", amount: "2" },
      { name: "Sealant", amount: "2" }
    ]
  }
];

export const PLANETS: PlanetData[] = [
  // --- SOL ---
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
  { name: "Grimsey", system: "Narion", resources: ["Water", "Iron", "Uranium"] },

  // --- CHEYENNE ---
  { name: "Akila", system: "Cheyenne", resources: ["Water", "Aluminum", "Nickel", "Cobalt", "Copper"] },
  { name: "Montara Luna", system: "Cheyenne", resources: ["Water", "Aluminum", "Nickel", "Cobalt", "Sealant"] },
  { name: "Washakie", system: "Cheyenne", resources: ["Water", "Argon", "Lead", "Silver", "Neon", "Uranium", "Benzene"] },
  { name: "Bindi", system: "Cheyenne", resources: ["Water", "Nickel", "Cobalt", "Tungsten"] },
  { name: "Codos", system: "Cheyenne", resources: ["Water", "Aluminum", "Iron", "Chlorine", "Sealant"] },
  { name: "Skink", system: "Cheyenne", resources: ["Nickel", "Copper", "Fluorine", "Ionic Liquids", "Mercury"] },

  // --- VOLII ---
  { name: "Volii Alpha", system: "Volii", resources: ["Water", "Benzene"] },
  { name: "Volii Beta", system: "Volii", resources: ["Water", "Ionic Liquids"] },
  { name: "Volii Gamma", system: "Volii", resources: ["Water", "Copper", "Fluorine", "Antimony", "Ionic Liquids"] },
  { name: "Volii Epsilon", system: "Volii", resources: ["Water", "Lead", "Chlorine", "Chlorosilanes"] },

  // --- PORRIMA ---
  { name: "Porrima I", system: "Porrima", resources: ["Helium-3", "Aluminum", "Neodymium"] },
  { name: "Porrima II", system: "Porrima", resources: ["Water", "Copper", "Fluorine", "Lithium"] },
  { name: "Porrima III", system: "Porrima", resources: ["Water", "Copper", "Gold", "Antimony"] },
  { name: "Porrima IV-c", system: "Porrima", resources: ["Nickel", "Iron", "Uranium", "Plutonium"] },

  // --- SCHRODINGER ---
  { name: "Schrodinger II", system: "Schrodinger", resources: ["Water", "Copper", "Antimony", "Gold"] },
  { name: "Schrodinger III", system: "Schrodinger", resources: ["Water", "Copper", "Iron", "Argon", "Cesium", "Indicite", "Solvent"] },
  { name: "Schrodinger VIII-a", system: "Schrodinger", resources: ["Water", "Iron", "Uranium", "Lithium", "Aldumite"] },

  // --- DECARAN ---
  { name: "Decaran VII-b", system: "Decaran", resources: ["Water", "Lead", "Uranium", "Vytinium"] },

  // --- CARINAE ---
  { name: "Carinae III-a", system: "Carinae", resources: ["Iron", "Alkanes", "Rothicite", "Tantalum"] },

  // --- OLYMPUS ---
  { name: "Nesoi", system: "Olympus", resources: ["Water", "Iron", "Uranium", "Argon", "Benzene", "Iridium"] },
  
  // --- ADDITIONAL ---
  { name: "Altair II", system: "Altair", resources: ["Water", "Iron", "Uranium", "Benzene"] },
  { name: "Bessel III-b", system: "Bessel", resources: ["Water", "Aluminum", "Nickel", "Cobalt"] },
  { name: "Cassiopeia I", system: "Cassiopeia", resources: ["Water", "Chlorine", "Copper", "Fluorine"] },
  { name: "Eridani II", system: "Eridani", resources: ["Water", "Copper", "Iron", "Fluorine"] },
  { name: "Feynman I", system: "Feynman", resources: ["Water", "Iron", "Lead"] },
  { name: "Guniibuu II", system: "Guniibuu", resources: ["Water", "Aluminum", "Beryllium", "Gold"] },
  { name: "Heisenberg II", system: "Heisenberg", resources: ["Water", "Copper", "Gold"] },
  { name: "Ixyll II", system: "Ixyll", resources: ["Water", "Nickel", "Iron"] },
  { name: "Jaffa IV", system: "Jaffa", resources: ["Water", "Copper", "Lead", "Gold", "Lithium"] },
  { name: "Kumasi II", system: "Kumasi", resources: ["Water", "Iron", "Silver"] },
  { name: "Linnaeus IV-b", system: "Linnaeus", resources: ["Water", "Aluminum", "Iron", "Beryllium"] },
  { name: "Maheo I", system: "Maheo", resources: ["Water", "Copper", "Iron", "Alkanes"] },
  { name: "Newton II", system: "Newton", resources: ["Water", "Iron", "Uranium"] },
  { name: "Oborum I", system: "Oborum", resources: ["Water", "Chlorine"] },
  { name: "Piazzi IV-c", system: "Piazzi", resources: ["Nickel", "Iron", "Uranium"] },
  { name: "Rana VI-a", system: "Rana", resources: ["Water", "Nickel", "Cobalt"] },
  { name: "Shoza III", system: "Shoza", resources: ["Water", "Copper", "Iron"] },
  { name: "Tau Ceti VIII-b", system: "Tau Ceti", resources: ["Water", "Aluminum", "Iron"] },
  { name: "Ursa Major II", system: "Ursa Major", resources: ["Water", "Copper", "Iron"] },
  { name: "Vega II-c", system: "Vega", resources: ["Nickel", "Iron", "Uranium"] }
];
