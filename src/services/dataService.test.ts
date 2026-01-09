import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    fetchGalacticData,
    processPlanets,
    processItems,
    processResourceTypes,
    GalaxyRaw,
    RecipeRaw,
    ResourceRaw
} from './dataService';

describe('dataService', () => {
    describe('processPlanets', () => {
        it('maps symbols to names and parses gravity', () => {
            const raw: unknown[] = [
                {
                    name: 'Jemison',
                    system: 'Alpha Centauri',
                    atmosphere: 'Standard O2',
                    gravity: '1.0',
                    temperature: 'Temperate',
                    type: 'Terrestrial',
                    water: 'Safe',
                    resources: ['H2O', 'Fe', 'Xyz']
                }
            ];

            const processed = processPlanets(raw as GalaxyRaw[]);
            expect(processed[0].resources).toContain('Water');
            expect(processed[0].resources).toContain('Iron');
            expect(processed[0].resources).toContain('Xyz');
            expect(processed[0].gravity).toBe(1.0);
        });

        it('handles missing resources gracefully', () => {
            const raw: unknown[] = [{ name: 'Empty' } as Partial<GalaxyRaw>];
            const processed = processPlanets(raw as GalaxyRaw[]);
            expect(processed[0].resources).toEqual([]);
        });
    });

    describe('processItems', () => {
        it('fixes typos and converts quantities to strings', () => {
            const raw: unknown[] = [
                {
                    name: 'Adaptive Frame',
                    requires: [
                        { name: 'Alluminum', quantity: 1 },
                        { name: 'Fe', quantity: 2 }
                    ]
                }
            ];

            const processed = processItems(raw as RecipeRaw[]);
            expect(processed[0].requirements[0].name).toBe('Aluminum');
            expect(processed[0].requirements[1].amount).toBe('2');
        });

        it('removes duplicates and sorts by name', () => {
            const raw: unknown[] = [
                { name: 'B', requires: [] },
                { name: 'A', requires: [] },
                { name: 'A', requires: [] }
            ];

            const processed = processItems(raw as RecipeRaw[]);
            expect(processed).toHaveLength(2);
            expect(processed[0].name).toBe('A');
            expect(processed[1].name).toBe('B');
        });
    });

    describe('processResourceTypes', () => {
        it('creates a mapping of resource names to types', () => {
            const raw: unknown[] = [
                { resource: 'Iron', type: 'inorganic' },
                { resource: 'Water', type: 'inorganic' }
            ];

            const processed = processResourceTypes(raw as ResourceRaw[]);
            expect(processed['Iron']).toBe('inorganic');
            expect(processed['Water']).toBe('inorganic');
        });
    });

    describe('fetchGalacticData', () => {
        beforeEach(() => {
            vi.stubGlobal('fetch', vi.fn());
        });

        it('successfully fetches and processes all data', async () => {
            const mockFetch = vi.mocked(fetch);
            mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [{ name: 'Test Planet', gravity: 1.0, resources: [] }] } as Response)
                .mockResolvedValueOnce({ ok: true, json: async () => [{ name: 'Test Item', requires: [] }] } as Response)
                .mockResolvedValueOnce({ ok: true, json: async () => [{ resource: 'Test', type: 'organic' }] } as Response);

            const result = await fetchGalacticData();
            expect(result.planets).toHaveLength(1);
            expect(result.items).toHaveLength(1);
            expect(result.resourceTypes['Test']).toBe('organic');
        });

        it('throws error if a fetch fails', async () => {
            vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 } as Response);

            await expect(fetchGalacticData()).rejects.toThrow(/Logistics link failure/);
        });

        it('throws error if data processing fails', async () => {
            vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => null } as Response);

            await expect(fetchGalacticData()).rejects.toThrow(/Corrupted galactic data/);
        });
    });
});
