import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppHeader } from './AppHeader';
import { SelectionControls } from './SelectionControls';
import { OptimizerReport } from './OptimizerReport';
import { ConstructionAnalysis, PlanetStrategy } from '@/types';

describe('Layout Components', () => {
    describe('AppHeader', () => {
        it('renders and handles view switching', () => {
            const setView = vi.fn();
            const setBidirectional = vi.fn();
            const { rerender } = render(
                <AppHeader
                    currentView="optimizer"
                    setCurrentView={setView}
                    useBidirectional={false}
                    setUseBidirectional={setBidirectional}
                />
            );

            expect(screen.getByText('StarLogi')).toBeInTheDocument();

            const dbButton = screen.getByRole('button', { name: /Database/i });
            fireEvent.click(dbButton);
            expect(setView).toHaveBeenCalledWith('database');

            const toggle = screen.getByTitle('Toggle Bidirectional Links');
            fireEvent.click(toggle);
            expect(setBidirectional).toHaveBeenCalledWith(true);

            // Rerender with database view
            rerender(
                <AppHeader
                    currentView="database"
                    setCurrentView={setView}
                    useBidirectional={true}
                    setUseBidirectional={setBidirectional}
                />
            );
            const optButton = screen.getByRole('button', { name: /Optimizer/i });
            fireEvent.click(optButton);
            expect(setView).toHaveBeenCalledWith('optimizer');
        });
    });

    describe('SelectionControls', () => {
        it('renders search and handles optimization click', () => {
            const setFilter = vi.fn();
            const handleOptimize = vi.fn();
            const toggleItem = vi.fn();
            const clearSelected = vi.fn();
            const mockItems = [{ name: 'Iron', requirements: [] }];

            render(
                <SelectionControls
                    itemFilter="test"
                    setItemFilter={setFilter}
                    selectedItems={mockItems}
                    toggleItem={toggleItem}
                    clearSelected={clearSelected}
                    handleOptimize={handleOptimize}
                    loading={false}
                    allItems={[]}
                />
            );

            const input = screen.getByPlaceholderText(/Filter blueprints/i);
            expect(input).toHaveValue('test');
            fireEvent.change(input, { target: { value: 'new filter' } });
            expect(setFilter).toHaveBeenCalledWith('new filter');

            const ironBadge = screen.getByText('Iron');
            fireEvent.click(ironBadge.parentElement!); // ResourceBadge is a wrapper
            expect(toggleItem).toHaveBeenCalled();

            const clearBtn = screen.getByText('Clear All');
            fireEvent.click(clearBtn);
            expect(clearSelected).toHaveBeenCalled();

            const optimizeBtn = screen.getByRole('button', { name: /GENERATE ROUTES/i });
            fireEvent.click(optimizeBtn);
            expect(handleOptimize).toHaveBeenCalled();
        });

        it('shows loading state on button', () => {
            render(
                <SelectionControls
                    itemFilter=""
                    setItemFilter={vi.fn()}
                    selectedItems={[{ name: 'Iron', requirements: [] }]}
                    toggleItem={vi.fn()}
                    clearSelected={vi.fn()}
                    handleOptimize={vi.fn()}
                    loading={true}
                    allItems={[]}
                />
            );
            expect(screen.getByText('ANALYZING')).toBeInTheDocument();
        });

        it('hides selected items list when empty', () => {
            render(
                <SelectionControls
                    itemFilter=""
                    setItemFilter={vi.fn()}
                    selectedItems={[]}
                    toggleItem={vi.fn()}
                    clearSelected={vi.fn()}
                    handleOptimize={vi.fn()}
                    loading={false}
                    allItems={[]}
                />
            );
            expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
        });

        it('shows recipe tree on hover of selected item', () => {
            const mockItems = [
                {
                    name: 'Adaptive Frame',
                    requirements: [{ name: 'Iron', amount: '1' }]
                }
            ];
            const allItems = [
                ...mockItems,
                { name: 'Iron', requirements: [] }
            ];

            render(
                <SelectionControls
                    itemFilter=""
                    setItemFilter={vi.fn()}
                    selectedItems={mockItems}
                    toggleItem={vi.fn()}
                    clearSelected={vi.fn()}
                    handleOptimize={vi.fn()}
                    loading={false}
                    allItems={allItems}
                />
            );

            const badge = screen.getByText('Adaptive Frame');
            fireEvent.mouseEnter(badge.parentElement!);

            expect(screen.getByText('Build Tree')).toBeInTheDocument();
            // Check for expansion pattern
            const treeContainer = screen.getByText('Build Tree').closest('.grid');
            expect(treeContainer).toHaveClass('group-hover/item:grid-rows-[1fr]');
            expect(treeContainer).not.toHaveClass('absolute');
        });
    });

    describe('OptimizerReport', () => {
        it('renders analysis stats and handles export', () => {
            const handleExport = vi.fn();
            const mockAnalysis: ConstructionAnalysis = {
                efficiencyScore: 85,
                recommendedPlanets: [{} as unknown as PlanetStrategy, {} as unknown as PlanetStrategy],
                totalResourcesRequired: [{ name: 'Water', amount: 10 }],
                logisticalSummary: '',
                outpostLimitReached: false,
                itemNames: [],
                manufacturingNodes: [],
                primaryAssemblyHub: '',
                he3Required: false,
                bidirectionalEnabled: false
            };

            render(<OptimizerReport analysis={mockAnalysis} handleExport={handleExport} />);

            expect(screen.getByText('85%')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // Outpost count
            expect(screen.getByText('Water')).toBeInTheDocument();

            const exportBtn = screen.getByText('Export Plan');
            fireEvent.click(exportBtn);
            expect(handleExport).toHaveBeenCalled();
        });
    });
});
