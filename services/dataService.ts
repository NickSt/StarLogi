
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
     * STRATEGY 1: Dynamic Import (Bundler Mode)
     * When running 'npm build' or standard Vite, this signals the bundler 
     * to include these JSON files in the JS bundle.
     */
    const [gMod, rMod] = await Promise.all([
      import("../data/galaxy.json"),
      import("../data/recipes.json")
    ]);
    galaxyJson = gMod.default;
    recipesJson = rMod.default;
  } catch (err) {
    /**
     * STRATEGY 2: Fetch Fallback (AI Studio / Restricted Env Mode)
     * If the module loader fails (common in AI Studio's internal preview),
     * we treat the JSON files as static network assets.
     */
    try {
      const [gRes, rRes] = await Promise.all([
        fetch("./data/galaxy.json"),
        fetch("./data/recipes.json")
      ]);

      if (!gRes.ok || !rRes.ok) throw new Error("Assets not found on network");
      
      galaxyJson = await gRes.json();
      recipesJson = await rRes.json();
    } catch (fetchErr: any) {
      console.error("Database link failure:", fetchErr);
      throw new Error(`Logistics database unreachable: ${fetchErr.message}`);
    }
  }

  try {
    // Process Planets
    const planets: PlanetData[] = (galaxyJson as any[]).map((p: any) => ({
      name: p.name,
      system: p.system,
      // Map symbols to names, otherwise keep the original name (for flora/fauna resources)
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

    // Filter out duplicates and sort
    const uniqueItems = Array.from(new Map(items.map(item => [item.name, item])).values())
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      items: uniqueItems,
      planets: planets.sort((a, b) => a.name.localeCompare(b.name))
    };
  } catch (error: any) {
    console.error("Data processing error:", error);
    throw new Error(`Logistics database integrity check failed: ${error.message}`);
  }
}
