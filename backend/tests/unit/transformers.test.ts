import { describe, expect, it } from 'vitest';
import type { RickAndMortyCharacter } from '../../src/types/rickAndMorty.js';
import { idsFromUrls, toCharacter } from '../../src/utils/transformers.js';
import { characterQuerySchema, createFavoriteSchema, idParamSchema } from '../../src/utils/validators.js';

const rick: RickAndMortyCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'],
};

describe('toCharacter', () => {
  it('normalizes a Rick and Morty character', () => {
    expect(toCharacter(rick)).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      image: 'https://example.com/rick.png',
      origin: { name: 'Earth (C-137)' },
      location: { name: 'Citadel of Ricks' },
      episodeCount: 2,
    });
  });
});

describe('idsFromUrls', () => {
  it('extracts numeric ids', () => {
    expect(idsFromUrls(['https://rickandmortyapi.com/api/character/1', 'bad'])).toEqual([1]);
  });
});

describe('validation', () => {
  it('rejects invalid ids', () => {
    const result = idParamSchema.safeParse({ id: 'abc' });
    expect(result.success).toBe(false);
  });

  it('accepts character filters', () => {
    const result = characterQuerySchema.parse({ page: '2', name: 'rick', status: 'alive' });
    expect(result).toEqual({ page: 2, name: 'rick', status: 'alive' });
  });

  it('rejects invalid favorite payloads', () => {
    expect(createFavoriteSchema.safeParse({ characterId: -1 }).success).toBe(false);
  });
});
