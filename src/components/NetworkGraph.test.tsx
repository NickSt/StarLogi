import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NetworkGraph } from './NetworkGraph';
import { ConstructionAnalysis } from '@/types';

const mockAnalysis: ConstructionAnalysis = {
    recommendedPlanets: [
        {
            planetName: 'Jemison',
            system: 'Alpha Centauri',
            resourcesFound: ['Water'],
            isAssemblyHub: true,
            links: [
                {
                    target: 'Mars',
                    direction: 'Outgoing',
                    type: 'Inter-System',
                    cargo: ['Iron']
                }
            ],
            linkCount: 1,
            notes: '',
            manufacturedItems: [],
            finalAssemblyItems: []
        },
        {
            planetName: 'Mars',
            system: 'Sol',
            resourcesFound: ['Iron'],
            isAssemblyHub: false,
            links: [],
            linkCount: 0,
            notes: '',
            manufacturedItems: ['Iron'],
            finalAssemblyItems: []
        }
    ],
    totalResourcesRequired: [{ name: 'Water', amount: 1 }, { name: 'Iron', amount: 1 }],
    efficiencyScore: 100,
    logisticalSummary: "Optimal configuration found.",
    outpostLimitReached: false,
    itemNames: ['Adaptive Frame'],
    manufacturingNodes: [
        {
            planetName: 'Mars',
            itemName: 'Iron',
            components: []
        }
    ],
    primaryAssemblyHub: 'Jemison',
    he3Required: false,
    bidirectionalEnabled: false
};

describe('NetworkGraph', () => {
    it('renders svg and topology elements', () => {
        const { container } = render(<NetworkGraph analysis={mockAnalysis} />);

        expect(screen.getByText('Topology Visualizer')).toBeInTheDocument();

        // Check for svg
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();

        // Check for nodes (circles)
        const circles = container.querySelectorAll('circle');
        expect(circles.length).toBeGreaterThan(0);

        // Check for planet names
        expect(screen.getByText('Jemison')).toBeInTheDocument();
        expect(screen.getByText('Mars')).toBeInTheDocument();
    });

    it('renders links between nodes', () => {
        const { container } = render(<NetworkGraph analysis={mockAnalysis} />);

        // Inter-System links use dashed lines (path with stroke-dasharray)
        const path = container.querySelector('path[stroke-dasharray="4,4"]');
        expect(path).toBeInTheDocument();
    });
});
