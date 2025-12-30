import { describe, it, expect } from 'vitest';
import { getLocalConstructionStrategy } from './localOptimizer';
import { ItemData, PlanetData } from '@/types';

// Mock Data
const mockItems: ItemData[] = [
    {
        name: 'Adaptive Frame',
        requirements: [
            { name: 'Iron', amount: '1' },
            { name: 'Aluminum', amount: '1' }
        ]
    },
    {
        name: 'Zero-G Gimbal',
        requirements: [
            { name: 'Copper', amount: '1' },
            { name: 'Titanium', amount: '2' }
        ]
    }
];

const mockPlanets: PlanetData[] = [
    {
        name: 'Andraphon',
        system: 'Narion',
        resources: ['Aluminum', 'Iron', 'He-3'],
        atmosphere: 'Thin CO2',
        gravity: 0.5,
        temperature: 'Temperate',
        type: 'Rock',
        water: 'None'
    },
    {
        name: 'Zamka',
        system: 'Alpha Centauri',
        resources: ['Copper', 'Nickel', 'Iron'],
        atmosphere: 'Standard',
        gravity: 1.0,
        temperature: 'Temperate',
        type: 'Rock',
        water: 'Safe'
    },
    {
        name: 'Titan',
        system: 'Sol',
        resources: ['Titanium', 'Tungsten'],
        atmosphere: 'Thick N2',
        gravity: 0.14,
        temperature: 'Deep Freeze',
        type: 'Ice',
        water: 'Safe'
    }
];

describe('getLocalConstructionStrategy', () => {
    it('throws error if no items selected', () => {
        expect(() => {
            getLocalConstructionStrategy([], mockItems, mockPlanets);
        }).toThrow("No items selected.");
    });

    it('finds a single planet (Andraphon) for Adaptive Frame', () => {
        const result = getLocalConstructionStrategy(['Adaptive Frame'], mockItems, mockPlanets);

        expect(result.recommendedPlanets).toHaveLength(1);
        expect(result.recommendedPlanets[0].planetName).toBe('Andraphon');
        expect(result.recommendedPlanets[0].resourcesFound).toContain('Iron');
        expect(result.recommendedPlanets[0].resourcesFound).toContain('Aluminum');
    });

    it('requires multiple planets for Zero-G Gimbal', () => {
        // Copper is on Zamka, Titanium is on Titan
        const result = getLocalConstructionStrategy(['Zero-G Gimbal'], mockItems, mockPlanets);

        // Should have at least 2 planets
        const planetNames = result.recommendedPlanets.map(p => p.planetName);
        expect(planetNames).toContain('Zamka');
        expect(planetNames).toContain('Titan');

        // Verify link exists (Titan -> Zamka or Zamka -> Titan depending on hub choice)
        // Logic likely picks one as assembly hub.
        const hub = result.recommendedPlanets.find(p => p.isAssemblyHub);
        expect(hub).toBeDefined();
    });
});
