import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOptimizer } from './useOptimizer';
import * as optimizerService from '@/services/localOptimizer';
import { ItemData, ConstructionAnalysis, PlanetStrategy } from '@/types';

vi.mock('@/services/localOptimizer');

const mockItem: ItemData = { name: 'Iron', requirements: [] };
const mockGalacticData = {
    items: [mockItem],
    planets: []
};

// Mock URL and Blob for export test
vi.stubGlobal('URL', {
    createObjectURL: vi.fn().mockReturnValue('mock-url'),
    revokeObjectURL: vi.fn()
});

describe('useOptimizer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('toggles item selection', () => {
        const { result } = renderHook(() => useOptimizer(mockGalacticData));

        act(() => {
            result.current.toggleItem(mockItem);
        });
        expect(result.current.selectedItems).toHaveLength(1);
        expect(result.current.selectedItems[0].name).toBe('Iron');

        act(() => {
            result.current.toggleItem(mockItem);
        });
        expect(result.current.selectedItems).toHaveLength(0);
    });

    it('clears selection', () => {
        const { result } = renderHook(() => useOptimizer(mockGalacticData));
        act(() => {
            result.current.toggleItem(mockItem);
        });
        act(() => {
            result.current.clearSelected();
        });
        expect(result.current.selectedItems).toHaveLength(0);
    });

    it('performs optimization', async () => {
        const mockAnalysisResult: ConstructionAnalysis = {
            efficiencyScore: 85,
            recommendedPlanets: [{} as PlanetStrategy, {} as PlanetStrategy],
            totalResourcesRequired: [{ name: 'Water', amount: 10 }],
            logisticalSummary: '',
            outpostLimitReached: false,
            itemNames: [],
            manufacturingNodes: [],
            primaryAssemblyHub: '',
            he3Required: false,
            bidirectionalEnabled: false
        };
        (optimizerService.getLocalConstructionStrategy as ReturnType<typeof vi.fn>).mockReturnValue(mockAnalysisResult);

        const { result } = renderHook(() => useOptimizer(mockGalacticData));

        act(() => {
            result.current.toggleItem(mockItem);
        });

        act(() => {
            result.current.handleOptimize();
        });

        expect(result.current.loading).toBe(true);

        act(() => {
            vi.runAllTimers();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.analysis).toEqual(mockAnalysisResult);
    });

    it('handles export', () => {
        const { result } = renderHook(() => useOptimizer(mockGalacticData));
        const clickSpy = vi.fn();
        vi.stubGlobal('document', {
            createElement: vi.fn().mockReturnValue({ click: clickSpy, download: '', href: '' })
        });

        const mockAnalysisForExport: ConstructionAnalysis = {
            efficiencyScore: 90,
            recommendedPlanets: [{} as PlanetStrategy],
            totalResourcesRequired: [{ name: 'Iron', amount: 5 }],
            logisticalSummary: 'Export test summary',
            outpostLimitReached: false,
            itemNames: ['Iron'],
            manufacturingNodes: [],
            primaryAssemblyHub: 'Alpha',
            he3Required: false,
            bidirectionalEnabled: false
        };

        act(() => {
            result.current.setAnalysis(mockAnalysisForExport);
        });

        act(() => {
            result.current.handleExport();
        });

        expect(clickSpy).toHaveBeenCalled();
    });
});
