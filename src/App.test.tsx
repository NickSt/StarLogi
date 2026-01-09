import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { useGalacticData } from '@/hooks/useGalacticData';
import { useOptimizer } from '@/hooks/useOptimizer';

vi.mock('@/hooks/useGalacticData');
vi.mock('@/hooks/useOptimizer');

// Mock child components that might be complex or have their own logic
vi.mock('@/components/SearchView', () => ({
    SearchView: () => <div data-testid="search-view">SearchView Mock</div>,
}));
vi.mock('@/components/NetworkGraph', () => ({
    NetworkGraph: () => <div data-testid="network-graph">NetworkGraph Mock</div>,
}));
vi.mock('@/components/PlanetCard', () => ({
    PlanetCard: () => <div data-testid="planet-card">PlanetCard Mock</div>,
}));

describe('App', () => {
    const mockGalacticData = {
        galacticData: {
            items: [{ name: 'Adaptive Frame', requirements: [] }],
            planets: [],
            resourceTypes: {}
        },
        initializing: false,
        itemTiers: { 'adaptive frame': 1 }
    };

    const mockOptimizer = {
        selectedItems: [],
        toggleItem: vi.fn(),
        clearSelected: vi.fn(),
        analysis: null,
        setAnalysis: vi.fn(),
        loading: false,
        useBidirectional: false,
        setUseBidirectional: vi.fn(),
        handleOptimize: vi.fn(),
        handleExport: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useGalacticData as ReturnType<typeof vi.fn>).mockReturnValue(mockGalacticData);
        (useOptimizer as ReturnType<typeof vi.fn>).mockReturnValue(mockOptimizer);
    });

    it('renders initialization state', () => {
        (useGalacticData as ReturnType<typeof vi.fn>).mockReturnValue({ ...mockGalacticData, initializing: true });
        render(<App />);
        expect(screen.getByText(/Initializing Data Stream/i)).toBeInTheDocument();
    });

    it('renders main view and allows item selection', () => {
        render(<App />);
        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
    });

    it('switches to database view', () => {
        render(<App />);
        const dbButton = screen.getByRole('button', { name: /Database/i });
        fireEvent.click(dbButton);
        expect(screen.getByTestId('search-view')).toBeInTheDocument();
    });

    it('shows optimizer results when analysis is present', () => {
        (useGalacticData as ReturnType<typeof vi.fn>).mockReturnValue(mockGalacticData);
        (useOptimizer as ReturnType<typeof vi.fn>).mockReturnValue({
            ...mockOptimizer,
            analysis: {
                efficiencyScore: 100,
                recommendedPlanets: [{ planetName: 'Jemison' }],
                totalResourcesRequired: []
            }
        });

        // We need to trigger a view change manually or mock state
        // But since App manages its own currentView state, we can simulate user click
        render(<App />);

        const optButton = screen.getByRole('button', { name: /Optimizer/i });
        fireEvent.click(optButton);

        expect(screen.getByText('Intelligence Report')).toBeInTheDocument();
        expect(screen.getByTestId('network-graph')).toBeInTheDocument();
        expect(screen.getByTestId('planet-card')).toBeInTheDocument();
    });
});
