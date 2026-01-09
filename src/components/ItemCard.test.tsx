import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ItemCard } from './ItemCard';
import { ItemData } from '@/types';

const mockItem: ItemData = {
    name: 'Adaptive Frame',
    requirements: [
        { name: 'Iron', amount: '1' },
        { name: 'Aluminium', amount: '1' }
    ]
};

const allItems = [
    mockItem,
    { name: 'Iron', requirements: [] },
    { name: 'Aluminium', requirements: [] }
];

describe('ItemCard', () => {
    it('renders item name and tier', () => {
        render(
            <ItemCard
                item={mockItem}
                isSelected={false}
                tier={2}
                allItems={allItems}
                onToggle={vi.fn()}
            />
        );
        expect(screen.getByText('Adaptive Frame')).toBeInTheDocument();
        expect(screen.getByText('TIER 2')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        const onToggle = vi.fn();
        render(
            <ItemCard
                item={mockItem}
                isSelected={false}
                tier={1}
                allItems={allItems}
                onToggle={onToggle}
            />
        );
        fireEvent.click(screen.getByText('Adaptive Frame'));
        expect(onToggle).toHaveBeenCalledWith(mockItem);
    });

    it('shows recipe tree on hover', () => {
        render(
            <ItemCard
                item={mockItem}
                isSelected={false}
                tier={1}
                allItems={allItems}
                onToggle={vi.fn()}
            />
        );

        expect(screen.getByText('Build Tree')).toBeInTheDocument();
        const treeContainer = screen.getByText('Build Tree').closest('.grid');
        expect(treeContainer).toHaveClass('group-hover:grid-rows-[1fr]');
        expect(treeContainer).not.toHaveClass('absolute');
    });
});
