
import { ItemData, PlanetData } from "../types";

/**
 * Symbol mapping to convert symbols in galaxy.json to full names used in recipes.json
 */
const RESOURCE_MAPPING: Record<string, string> = {
  "Al": "Aluminum",
  "Fe": "Iron",
  "He-3": "Helium-3",
  "Be": "Beryllium",
  "Cu": "Copper",
  "Pb": "Lead",
  "Ni": "Nickel",
  "Co": "Cobalt",
  "Li": "Lithium",
  "H2O": "Water",
  "HnCn": "Alkanes",
  "Dy": "Dysprosium",
  "IL": "Ionic Liquids",
  "Ar": "Argon",
  "U": "Uranium",
  "Ir": "Iridium",
  "Ag": "Silver",
  "Cl": "Chlorine",
  "F": "Fluorine",
  "SiH3Cl": "Chlorosilanes",
  "Nd": "Neodymium",
  "Pt": "Platinum",
  "Pd": "Palladium",
  "xF4": "Tetrafluorides",
  "V": "Vanadium",
  "Yb": "Ytterbium",
  "Ti": "Titanium",
  "Au": "Gold",
  "W": "Tungsten",
  "Pu": "Plutonium",
  "Eu": "Europium",
  "Ne": "Neon",
  "Hg": "Mercury",
  "Cs": "Caesium",
  "Sb": "Antimony",
  "R-COOH": "Carboxylic Acids",
  "C6Hn": "Benzene",
  "Rc": "Rothicite",
  "Vy": "Vytinium",
  "Vr": "Veryl",
  "Ad": "Aldumite",
  "In": "Indicite",
  "Ct": "Caelumite",
  "Ta": "Tantalum"
};

/**
 * Common typo corrections for provided data files
 */
const TYPO_FIXES: Record<string, string> = {
  "Alluminum": "Aluminum",
  "Tanalum": "Tantalum"
};

export async function fetchGalacticData(): Promise<{ items: ItemData[], planets: PlanetData[] }> {
  try {
    // Vite handles JSON imports or we can fetch them via the public path
    const [galaxyResponse, recipesResponse] = await Promise.all([
      fetch('./data/galaxy.json'),
      fetch('./data/recipes.json')
    ]);

    if (!galaxyResponse.ok || !recipesResponse.ok) {
      throw new Error("Failed to load local database files.");
    }

    const rawGalaxy = await galaxyResponse.json();
    const rawRecipes = await recipesResponse.json();

    // 1. Process Planets
    const planets: PlanetData[] = rawGalaxy.map((p: any) => ({
      name: p.name,
      system: p.system,
      // Map symbols to names, otherwise keep the original name (for flora/fauna resources)
      resources: (p.resources || []).map((res: string) => RESOURCE_MAPPING[res] || res)
    }));

    // 2. Process Constructible Items
    const items: ItemData[] = rawRecipes.map((r: any) => ({
      name: r.name,
      requirements: (r.requires || []).map((req: any) => {
        const rawName = req.name;
        // Apply typo fixes (e.g. Alluminum -> Aluminum)
        const fixedName = TYPO_FIXES[rawName] || rawName;
        return {
          name: fixedName,
          amount: req.quantity.toString()
        };
      })
    }));

    // Filter out duplicates and sort
    const uniqueItems = Array.from(new Map(items.map(item => [item.name, item])).values())
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      items: uniqueItems,
      planets: planets.sort((a, b) => a.name.localeCompare(b.name))
    };
  } catch (error: any) {
    console.error("Data processing error:", error);
    throw new Error("Logistics database connection interrupted. Ensure galaxy.json and recipes.json are available.");
  }
}
