import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlanetCard } from './PlanetCard';
import { PlanetStrategy } from '@/types';

const mockStrategy: PlanetStrategy = {
    planetName: 'Jemison',
    system: 'Alpha Centauri',
    resourcesFound: ['Water', 'Iron'],
    isAssemblyHub: true,
    links: [],
    linkCount: 0,
    notes: '',
    manufacturedItems: [],
    finalAssemblyItems: []
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
        expect(screen.getByText('Industrial Hub')).toBeInTheDocument();
    });

    it('shows detailed stats on hover', () => {
        render(
            <PlanetCard
                planetName="Jemison"
                system="Alpha Centauri"
                sites={[mockStrategy]}
                index={0}
                planetData={{
                    name: 'Jemison',
                    system: 'Alpha Centauri',
                    resources: ['Water', 'Fiber'],
                    atmosphere: 'Standard O2',
                    gravity: 1.0,
                    temperature: 'Temperate',
                    type: 'Terrestrial',
                    water: 'Safe'
                }}
                resourceTypes={{
                    'Water': 'inorganic',
                    'Fiber': 'organic'
                }}
            />
        );

        const card = screen.getByText('Jemison').closest('.glass-panel');
        fireEvent.mouseEnter(card!);

        expect(screen.getByText('Atmosphere')).toBeInTheDocument();
        expect(screen.getByText('Standard O2')).toBeInTheDocument();
        expect(screen.getByText('Gravity')).toBeInTheDocument();
        expect(screen.getByText('1G')).toBeInTheDocument();

        // Check resources on hover
        const waterBadges = screen.getAllByText('Water');
        expect(waterBadges.length).toBeGreaterThan(0);
        const fiberBadges = screen.getAllByText('Fiber');
        expect(fiberBadges.length).toBeGreaterThan(0);
    });

    it('renders manufactured items and logistics links', () => {
        const complexStrategy: PlanetStrategy = {
            ...mockStrategy,
            manufacturedItems: ['Adaptive Frame'],
            links: [
                { direction: 'Incoming', target: 'Moon Base', type: 'Inter-System', cargo: ['He3', 'Iron', 'Water', 'Copper'] }
            ]
        };

        render(
            <PlanetCard
                planetName="Jemison"
                system="Alpha Centauri"
                sites={[complexStrategy]}
                index={0}
            />
        );

        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
        expect(screen.getByText('OVERLOAD: 4/3')).toBeInTheDocument();
        expect(screen.getByText('Moon Base')).toBeInTheDocument();
    });
});
