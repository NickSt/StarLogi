import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResourceBadge } from './ResourceBadge';

describe('ResourceBadge', () => {
    it('renders resource name', () => {
        render(<ResourceBadge name="Water" />);
        expect(screen.getByText('Water')).toBeInTheDocument();
    });

    it('renders resource name and amount', () => {
        render(<ResourceBadge name="Water" amount="10" />);
        expect(screen.getByText('Water')).toBeInTheDocument();
        expect(screen.getByText('x10')).toBeInTheDocument();
    });
});
