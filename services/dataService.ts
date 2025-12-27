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

export async function fetchGalacticData(): Promise<{ items: ItemData[], planets: PlanetData[] }> {
  let galaxyJson: any;
  let recipesJson: any;

  try {
    /**
     * Using relative paths without a leading slash is the most compatible way
     * to ensure the browser resolves the 'data' directory relative to the current
     * application path (e.g., both locally and on GitHub Pages sub-paths).
     */
    const [gRes, rRes] = await Promise.all([
      fetch("data/galaxy.json"),
      fetch("data/recipes.json")
    ]);

    if (!gRes.ok || !rRes.ok) {
      throw new Error(`Asset link failed: Galaxy Status ${gRes.status}, Recipes Status ${rRes.status}. Paths attempted: ${gRes.url}, ${rRes.url}`);
    }
    
    galaxyJson = await gRes.json();
    recipesJson = await rRes.json();
  } catch (err: any) {
    console.error("Database connection failed:", err);
    throw new Error(`Logistics link failure: Could not reach galactic data. ${err.message}`);
  }

  try {
    // Process Planets
    const planets: PlanetData[] = (galaxyJson as any[]).map((p: any) => ({
      name: p.name,
      system: p.system,
      // Map symbols to names, otherwise keep original
      resources: (p.resources || []).map((res: string) => RESOURCE_MAPPING[res] || res)
    }));

    // Process Constructible Items
    const items: ItemData[] = (recipesJson as any[]).map((r: any) => ({
      name: r.name,
      requirements: (r.requires || []).map((req: any) => {
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

    return {
      items: uniqueItems,
      planets: planets.sort((a, b) => a.name.localeCompare(b.name))
    };
  } catch (error: any) {
    console.error("Data processing failure:", error);
    throw new Error(`Corrupted galactic data: ${error.message}`);
  }
}
