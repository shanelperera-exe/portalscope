import { describe, expect, it, vi } from 'vitest';
import { CharacterService } from '../../src/services/character.service.js';
import { FavoriteService } from '../../src/services/favorite.service.js';
import { ConflictError, NotFoundError } from '../../src/utils/errors.js';
import type { RickAndMortyClient } from '../../src/clients/rickAndMorty.client.js';
import type { FavoriteRepository } from '../../src/repositories/favorite.repository.js';

function mockClient(): RickAndMortyClient {
  return {
    getCharacter: vi.fn(),
    getCharacters: vi.fn(),
    listCharacters: vi.fn(),
  } as unknown as RickAndMortyClient;
}

describe('CharacterService', () => {
  it('maps paginated character results', async () => {
    const client = mockClient();
    vi.mocked(client.listCharacters).mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          image: 'https://example.com/rick.png',
          origin: { name: 'Earth', url: '' },
          location: { name: 'Citadel', url: '' },
          episode: ['e1'],
        },
      ],
    });

    const service = new CharacterService(client);
    const result = await service.list({ page: 1, name: 'rick' });
    expect(result.pagination.count).toBe(1);
    expect(result.data[0]?.name).toBe('Rick Sanchez');
  });
});

describe('FavoriteService', () => {
  it('rejects duplicate favorites through the repository', async () => {
    const repo = {
      create: vi.fn().mockRejectedValue(new ConflictError('Character is already in favorites')),
      list: vi.fn(),
      findByCharacterId: vi.fn(),
      deleteByCharacterId: vi.fn(),
    } as unknown as FavoriteRepository;
    const characters = new CharacterService(mockClient());
    vi.spyOn(characters, 'getById').mockResolvedValue({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      image: 'x',
      origin: { name: 'Earth' },
      location: { name: 'Citadel' },
      episodeCount: 1,
    });

    const service = new FavoriteService(repo, characters);
    await expect(service.add(1)).rejects.toBeInstanceOf(ConflictError);
  });

  it('throws when removing a missing favorite', async () => {
    const repo = {
      deleteByCharacterId: vi.fn().mockResolvedValue(false),
    } as unknown as FavoriteRepository;
    const service = new FavoriteService(repo, new CharacterService(mockClient()));
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundError);
  });
});
