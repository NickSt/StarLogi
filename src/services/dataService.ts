import { ItemData, PlanetData } from '@/types';

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
  "Cs": "Cesium",
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
 * Common typo corrections or alternate spellings for provided data files
 */
const TYPO_FIXES: Record<string, string> = {
  "Alluminum": "Aluminum",
  "Tanalum": "Tantalum",
  "Caesium": "Cesium"
};

// Raw JSON interfaces
interface GalaxyRaw {
  name: string;
  system: string;
  atmosphere: string;
  gravity: number;
  temperature: string;
  type: string;
  water: string;
  resources: string[];
}

interface RecipeRequirementRaw {
  name: string;
  quantity: number;
}

interface RecipeRaw {
  name: string;
  requires: RecipeRequirementRaw[];
}

interface ResourceRaw {
  resource: string;
  type: 'organic' | 'inorganic' | 'manufactured';
}

export async function fetchGalacticData(): Promise<{ items: ItemData[], planets: PlanetData[], resourceTypes: Record<string, 'organic' | 'inorganic' | 'manufactured'> }> {
  let galaxyJson: GalaxyRaw[];
  let recipesJson: RecipeRaw[];
  let resourcesJson: ResourceRaw[];

  try {
    /**
     * Using relative paths without a leading slash is the most compatible way
     * to ensure the browser resolves the 'data' directory relative to the current
     * application path (e.g., both locally and on GitHub Pages sub-paths).
     */
    const [gRes, rRes, resRes] = await Promise.all([
      fetch("data/galaxy.json"),
      fetch("data/recipes.json"),
      fetch("data/resources.json")
    ]);

    if (!gRes.ok || !rRes.ok || !resRes.ok) {
      throw new Error(`Asset link failed: Galaxy ${gRes.status}, Recipes ${rRes.status}, Resources ${resRes.status}`);
    }

    galaxyJson = await gRes.json() as GalaxyRaw[];
    recipesJson = await rRes.json() as RecipeRaw[];
    resourcesJson = await resRes.json() as ResourceRaw[];
  } catch (err: unknown) {
    console.error("Database connection failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Logistics link failure: Could not reach galactic data. ${msg}`);
  }

  try {
    // Process Planets
    const planets: PlanetData[] = galaxyJson.map((p) => ({
      name: p.name,
      system: p.system,
      atmosphere: p.atmosphere,
      gravity: typeof p.gravity === 'string' ? parseFloat(p.gravity) : p.gravity, // Ensure number 
      temperature: p.temperature,
      type: p.type,
      water: p.water,
      // Map symbols to names, otherwise keep original
      resources: (p.resources || []).map((res: string) => RESOURCE_MAPPING[res] || res)
    }));

    // Process Constructible Items
    const items: ItemData[] = recipesJson.map((r) => ({
      name: r.name,
      requirements: (r.requires || []).map((req) => {
        const rawName = req.name;
        const fixedName = TYPO_FIXES[rawName] || rawName;
        return {
          name: fixedName,
          amount: req.quantity.toString()
        };
      })
    }));

    const uniqueItems = Array.from(new Map(items.map(item => [item.name, item])).values())
      .sort((a, b) => a.name.localeCompare(b.name));

    // Process Resource Types
    const resourceTypes: Record<string, 'organic' | 'inorganic' | 'manufactured'> = {};
    resourcesJson.forEach((r) => {
      resourceTypes[r.resource] = r.type;
    });

    return {
      items: uniqueItems,
      planets: planets.sort((a, b) => a.name.localeCompare(b.name)),
      resourceTypes
    };
  } catch (error: unknown) {
    console.error("Data processing failure:", error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Corrupted galactic data: ${msg}`);
  }
}
