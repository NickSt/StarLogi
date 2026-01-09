import { useState, useEffect, useMemo } from 'react';
import { fetchGalacticData } from '@/services/dataService';
import { ItemData, PlanetData } from '@/types';

export interface GalacticDataState {
    items: ItemData[];
    planets: PlanetData[];
    resourceTypes: Record<string, string>;
}

export function useGalacticData() {
    const [galacticData, setGalacticData] = useState<GalacticDataState | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const data = await fetchGalacticData();
                setGalacticData(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message);
                }
            } finally {
                setInitializing(false);
            }
        }
        init();
    }, []);

    const itemTiers = useMemo(() => {
        if (!galacticData) return {};
        const tiers: Record<string, number> = {};
        const itemsMap = new Map<string, ItemData>(galacticData.items.map(i => [i.name.toLowerCase(), i]));

        function calculateTier(name: string, visited = new Set<string>()): number {
            const lowerName = name.toLowerCase();
            if (tiers[lowerName]) return tiers[lowerName];
            if (visited.has(lowerName)) return 1;

            const item = itemsMap.get(lowerName);
            if (!item) return 0;

            visited.add(lowerName);
            let maxSubTier = 0;
            for (const req of (item.requirements || [])) {
                maxSubTier = Math.max(maxSubTier, calculateTier(req.name, visited));
            }

            const result = maxSubTier + 1;
            tiers[lowerName] = result;
            return result;
        }

        galacticData.items.forEach(item => calculateTier(item.name));
        return tiers;
    }, [galacticData]);

    return { galacticData, initializing, itemTiers };
}
