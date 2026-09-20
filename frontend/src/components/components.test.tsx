import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CharacterCard } from '../components/CharacterCard';
import { ErrorState } from '../components/ErrorState';
import { FavoriteButton } from '../components/FavoriteButton';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import type { Character } from '../types/models';

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: { name: 'Earth' },
  location: { name: 'Citadel of Ricks' },
  episodeCount: 51,
};

describe('CharacterCard', () => {
  it('renders character details', () => {
    render(
      <MemoryRouter>
        <CharacterCard character={rick} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });
});

describe('states', () => {
  it('shows loading copy', () => {
    render(<LoadingState />);
    expect(screen.getByText('Exploring the multiverse...')).toBeInTheDocument();
  });

  it('shows an error with retry', () => {
    render(<ErrorState onRetry={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});

describe('FavoriteButton', () => {
  it('toggles label based on active state', () => {
    const { rerender } = render(<FavoriteButton active={false} onToggle={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
    rerender(<FavoriteButton active onToggle={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  it('renders page controls', () => {
    render(<Pagination page={2} pages={5} onPage={() => undefined} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });
});
