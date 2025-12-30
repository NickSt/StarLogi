import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlanetCard } from './PlanetCard';
import { PlanetStrategy, PlanetData } from '@/types';

const mockStrategy: PlanetStrategy = {
    planetName: 'Jemison',
    system: 'Alpha Centauri',
    resourcesFound: ['Water', 'Argon'],
    notes: '',
    links: [],
    linkCount: 0,
    manufacturedItems: [],
    finalAssemblyItems: []
};

const mockPlanetData: PlanetData = {
    name: 'Jemison',
    system: 'Alpha Centauri',
    resources: ['Water', 'Argon', 'Chlorine'],
    atmosphere: 'Standard O2',
    gravity: 1.0,
    temperature: 'Temperate',
    type: 'Terrestrial',
    water: 'Safe'
};

const mockResourceTypes = {
    'Water': 'inorganic',
    'Argon': 'inorganic',
    'Chlorine': 'inorganic'
};

describe('PlanetCard', () => {
    it('renders planet name and system', () => {
        render(
            <PlanetCard
                planetName="Jemison"
                system="Alpha Centauri"
                sites={[mockStrategy]}
                index={0}
            />
        );

        expect(screen.getByText('Jemison')).toBeInTheDocument();
        expect(screen.getByText('Alpha Centauri SYSTEM')).toBeInTheDocument();
    });

    it('shows details on hover', async () => {
        render(
            <PlanetCard
                planetName="Jemison"
                system="Alpha Centauri"
                sites={[mockStrategy]}
                index={0}
                planetData={mockPlanetData}
                resourceTypes={mockResourceTypes}
            />
        );

        // Hover shouldn't be visible initially
        expect(screen.queryByText('Standard O2')).not.toBeInTheDocument();

        // Simulate hover
        const card = screen.getByText('Jemison').closest('div.glass-panel');
        if (!card) throw new Error('Card container not found');

        fireEvent.mouseEnter(card);

        // Now validation data should appear
        expect(await screen.findByText('Standard O2')).toBeInTheDocument();
        expect(screen.getByText('1G')).toBeInTheDocument();
        expect(screen.getByText('Temperate')).toBeInTheDocument();
    });
});
