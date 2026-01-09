import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecipePreview } from './RecipePreview';
import { ItemData } from '@/types';

const mockItems: ItemData[] = [
    {
        name: 'Adaptive Frame',
        requirements: [
            { name: 'Iron', amount: '1' },
            { name: 'Aluminium', amount: '1' }
        ]
    },
    {
        name: 'Iron',
        requirements: []
    },
    {
        name: 'Aluminium',
        requirements: []
    }
];

describe('RecipePreview', () => {
    it('renders "Resource" for items not in the list', () => {
        render(<RecipePreview itemName="Unknown" allItems={[]} />);
        expect(screen.getByText('Resource')).toBeInTheDocument();
    });

    it('renders compact mode', () => {
        render(<RecipePreview itemName="Adaptive Frame" allItems={mockItems} compact={true} />);
        expect(screen.getByText('Iron')).toBeInTheDocument();
        expect(screen.getByText('Aluminium')).toBeInTheDocument();
    });

    it('renders full tree mode', () => {
        render(<RecipePreview itemName="Adaptive Frame" allItems={mockItems} />);
        expect(screen.getByText('Build Tree')).toBeInTheDocument();
        expect(screen.getByText('Iron')).toBeInTheDocument();
        expect(screen.getByText('Aluminium')).toBeInTheDocument();
        expect(screen.getAllByText('x1')).toHaveLength(2);
    });

    it('renders nested requirements', () => {
        const nestedItems: ItemData[] = [
            ...mockItems,
            {
                name: 'Complex Item',
                requirements: [
                    { name: 'Adaptive Frame', amount: '2' }
                ]
            }
        ];
        render(<RecipePreview itemName="Complex Item" allItems={nestedItems} />);
        expect(screen.getByText('Build Tree')).toBeInTheDocument();
        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
        expect(screen.getByText('Iron')).toBeInTheDocument();
        expect(screen.getByText('Aluminium')).toBeInTheDocument();
    });
});
