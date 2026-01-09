import { useState, useCallback } from 'react';
import { getLocalConstructionStrategy } from '@/services/localOptimizer';
import { ItemData, ConstructionAnalysis, PlanetData } from '@/types';

export function useOptimizer(galacticData: { items: ItemData[]; planets: PlanetData[] } | null) {
    const [selectedItems, setSelectedItems] = useState<ItemData[]>([]);
    const [analysis, setAnalysis] = useState<ConstructionAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [useBidirectional, setUseBidirectional] = useState(false);

    const toggleItem = useCallback((item: ItemData) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.name === item.name);
            if (exists) {
                return prev.filter(i => i.name !== item.name);
            }
            return [...prev, item];
        });
    }, []);

    const clearSelected = useCallback(() => setSelectedItems([]), []);

    const handleOptimize = useCallback(() => {
        if (!galacticData || selectedItems.length === 0) return;
        setLoading(true);

        // Using setTimeout to allow loading state to render
        setTimeout(() => {
            try {
                const result = getLocalConstructionStrategy(
                    selectedItems.map(i => i.name),
                    galacticData.items,
                    galacticData.planets,
                    useBidirectional
                );
                setAnalysis(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 800);
    }, [selectedItems, galacticData, useBidirectional]);

    const handleExport = useCallback(() => {
        if (!analysis) return;
        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StarLogi-Plan-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [analysis]);

    return {
        selectedItems,
        toggleItem,
        clearSelected,
        analysis,
        setAnalysis,
        loading,
        useBidirectional,
        setUseBidirectional,
        handleOptimize,
        handleExport
    };
}
