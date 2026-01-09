import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchView } from './SearchView';
import { PlanetData, ItemData } from '@/types';

const mockPlanets: PlanetData[] = [
    {
        name: 'Jemison',
        system: 'Alpha Centauri',
        resources: ['Water', 'Argon', 'Chlorine'],
        atmosphere: 'Standard O2',
        gravity: 1.0,
        temperature: 'Temperate',
        type: 'Terrestrial',
        water: 'Safe'
    },
    {
        name: 'Mars',
        system: 'Sol',
        resources: ['Iron', 'Chlorosilanes'],
        atmosphere: 'Thin CO2',
        gravity: 0.38,
        temperature: 'Cold',
        type: 'Terrestrial',
        water: 'Safe'
    }
];

const mockItems: ItemData[] = [
    {
        name: 'Adaptive Frame',
        requirements: [
            { name: 'Iron', amount: '1' },
            { name: 'Aluminium', amount: '1' }
        ]
    },
    {
        name: 'Reactive Gauge',
        requirements: [
            { name: 'Aluminium', amount: '2' },
            { name: 'Copper', amount: '1' }
        ]
    }
];

describe('SearchView', () => {
    it('renders search input', () => {
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={mockItems} onSelectItem={onSelectItem} />);
        expect(screen.getByPlaceholderText(/Search planets, resources/)).toBeInTheDocument();
    });

    it('filters items by name', () => {
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={mockItems} onSelectItem={onSelectItem} />);

        const input = screen.getByPlaceholderText(/Search planets, resources/);
        fireEvent.change(input, { target: { value: 'Adaptive' } });

        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
        expect(screen.queryByText('Reactive Gauge')).not.toBeInTheDocument();
    });

    it('filters planets by name or system', () => {
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={mockItems} onSelectItem={onSelectItem} />);

        const input = screen.getByPlaceholderText(/Search planets, resources/);

        // By name
        fireEvent.change(input, { target: { value: 'Mars' } });
        expect(screen.getByText('Mars')).toBeInTheDocument();

        // By system
        fireEvent.change(input, { target: { value: 'Sol' } });
        expect(screen.getByText('Mars')).toBeInTheDocument();
    });

    it('filters by resource', () => {
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={mockItems} onSelectItem={onSelectItem} />);

        const input = screen.getByPlaceholderText(/Search planets, resources/);
        fireEvent.change(input, { target: { value: 'Iron' } });

        // Should match Mars (planet with Iron) and Adaptive Frame (item requiring Iron)
        expect(screen.getByText('Mars')).toBeInTheDocument();
        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
    });

    it('calls onSelectItem when track button is clicked', () => {
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={mockItems} onSelectItem={onSelectItem} />);

        const input = screen.getByPlaceholderText(/Search planets, resources/);
        fireEvent.change(input, { target: { value: 'Adaptive' } });

        const trackButton = screen.getByRole('button', { name: /Track/i });
        fireEvent.click(trackButton);

        expect(onSelectItem).toHaveBeenCalledWith('Adaptive Frame');
    });

    it('handles recursive matches for nested items', () => {
        const nestedItems: ItemData[] = [
            ...mockItems,
            {
                name: 'Comm Relay',
                requirements: [
                    { name: 'Adaptive Frame', amount: '1' }
                ]
            }
        ];
        const onSelectItem = vi.fn();
        render(<SearchView planets={mockPlanets} items={nestedItems} onSelectItem={onSelectItem} />);

        const input = screen.getByPlaceholderText(/Search planets, resources/);
        fireEvent.change(input, { target: { value: 'Iron' } });

        // Should match Comm Relay because it requires Adaptive Frame which requires Iron
        expect(screen.getByText('Comm Relay')).toBeInTheDocument();
    });
});
