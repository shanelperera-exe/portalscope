import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

const rick = {
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

function json(data: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } }),
  );
}

describe('Characters page', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/characters?') || url.endsWith('/characters')) {
          return json({ data: [rick], pagination: { page: 1, pages: 2, count: 20 } });
        }
        if (url.includes('/favorites')) {
          return json({ data: [] });
        }
        return json({ info: {}, results: [] });
      }),
    );
  });

  it('renders a character grid, search, filters, and pagination', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/characters']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search'), 'rick');
    expect(fetch).toHaveBeenCalled();
  });

  it('shows a friendly error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(JSON.stringify({ error: 'down' }), { status: 502 }))),
    );
    render(
      <MemoryRouter initialEntries={['/characters']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Oops! The portal is unstable. We couldn't retrieve the characters right now."),
    ).toBeInTheDocument();
  });
});

describe('Character details', () => {
  it('loads character information and favorite controls', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/favorites')) {
          return json({ data: [] });
        }
        return json(rick);
      }),
    );

    render(
      <MemoryRouter initialEntries={['/characters/1']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText(/Episode count: 51/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
  });
});
