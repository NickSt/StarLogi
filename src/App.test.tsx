import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the dataService
vi.mock('@/services/dataService', () => ({
    fetchGalacticData: vi.fn().mockResolvedValue({
        items: [],
        planets: [],
        resourceTypes: {}
    })
}));

describe('App', () => {
    it('renders without crashing', async () => {
        render(<App />);
        expect(await screen.findByText('GENERATE ROUTES')).toBeInTheDocument();
    });
});
