import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGalacticData } from './useGalacticData';
import * as dataService from '@/services/dataService';

vi.mock('@/services/dataService');

const mockData = {
    items: [
        { name: 'Adaptive Frame', requirements: [{ name: 'Iron', amount: '1' }, { name: 'Aluminium', amount: '1' }] },
        { name: 'Iron', requirements: [] },
        { name: 'Aluminium', requirements: [] }
    ],
    planets: [],
    resourceTypes: {}
};

describe('useGalacticData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches data and calculates tiers on initialization', async () => {
        (dataService.fetchGalacticData as ReturnType<typeof vi.fn>).mockResolvedValue(mockData);

        const { result } = renderHook(() => useGalacticData());

        expect(result.current.initializing).toBe(true);
        expect(result.current.galacticData).toBe(null);

        await waitFor(() => expect(result.current.initializing).toBe(false));

        expect(result.current.galacticData).toEqual(mockData);
        expect(result.current.itemTiers).toEqual({
            'adaptive frame': 2,
            'iron': 1,
            'aluminium': 1
        });
    });

    it('handles fetch errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (dataService.fetchGalacticData as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Fetch failed'));

        const { result } = renderHook(() => useGalacticData());

        await waitFor(() => expect(result.current.initializing).toBe(false));

        expect(result.current.galacticData).toBe(null);
        expect(consoleSpy).toHaveBeenCalledWith('Fetch failed');
        consoleSpy.mockRestore();
    });
});
