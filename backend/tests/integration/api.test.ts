import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import type { AppEnv } from '../../src/config/env.js';
import type { FavoriteRepository } from '../../src/repositories/favorite.repository.js';
import { ConflictError } from '../../src/utils/errors.js';

const env: AppEnv = {
  PORT: 3000,
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://explorer:explorer@localhost:5432/interdimensional_explorer',
  RICK_AND_MORTY_API_URL: 'https://rickandmortyapi.com/api',
  RICK_AND_MORTY_API_TIMEOUT: 5000,
  CORS_ORIGIN: 'http://localhost:5173',
  ENABLE_TEST_FAILURES: false,
  APP_VERSION: '1.0.0',
};

const rickPayload = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  episode: ['https://rickandmortyapi.com/api/episode/1'],
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('API integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns health', async () => {
    const app = createApp(env, { fetchImpl: vi.fn() as unknown as typeof fetch });
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.service).toBe('interdimensional-explorer-backend');
    expect(response.body.status).toBe('ok');
  });

  it('returns characters from the external API', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [rickPayload],
      }),
    );
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/characters?name=rick');
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe('Rick Sanchez');
    expect(response.body.pagination.pages).toBe(1);
  });

  it('returns a single character', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, rickPayload));
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/characters/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it('rejects invalid character ids', async () => {
    const app = createApp(env);
    const response = await request(app).get('/api/characters/abc');
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_REQUEST');
  });

  it('maps missing characters to 404', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(404, { error: 'Not found' }));
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/characters/999999');
    expect(response.status).toBe(404);
  });

  it('maps external API outages to 502', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network'));
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/characters');
    expect(response.status).toBe(502);
    expect(response.body.code).toBe('EXTERNAL_API_ERROR');
  });

  it('lists locations', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
          {
            id: 1,
            name: 'Earth',
            type: 'Planet',
            dimension: 'C-137',
            residents: [],
          },
        ],
      }),
    );
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/locations');
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe('Earth');
  });

  it('lists episodes', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [
          {
            id: 1,
            name: 'Pilot',
            air_date: 'December 2, 2013',
            episode: 'S01E01',
            characters: [],
          },
        ],
      }),
    );
    const app = createApp(env, { fetchImpl: fetchImpl as unknown as typeof fetch });
    const response = await request(app).get('/api/episodes');
    expect(response.status).toBe(200);
    expect(response.body.data[0].episode).toBe('S01E01');
  });

  it('rejects invalid favorite payloads', async () => {
    const app = createApp(env);
    const response = await request(app).post('/api/favorites').send({});
    expect(response.status).toBe(400);
  });

  it('creates, lists, and deletes favorites', async () => {
    const store = new Map<number, { id: number; userId: number; characterId: number; createdAt: Date }>();
    const favoriteRepository = {
      list: async () => [...store.values()],
      findByCharacterId: async (characterId: number) => store.get(characterId) ?? null,
      create: async (characterId: number) => {
        if (store.has(characterId)) {
          throw new ConflictError('Character is already in favorites');
        }
        const favorite = {
          id: store.size + 1,
          userId: 1,
          characterId,
          createdAt: new Date(),
        };
        store.set(characterId, favorite);
        return favorite;
      },
      deleteByCharacterId: async (characterId: number) => store.delete(characterId),
    } as unknown as FavoriteRepository;

    const fetchImpl = vi.fn().mockImplementation(() => Promise.resolve(jsonResponse(200, rickPayload)));
    const app = createApp(env, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      favoriteRepository,
    });

    const created = await request(app).post('/api/favorites').send({ characterId: 1 });
    expect(created.status).toBe(201);
    expect(created.body.characterId).toBe(1);

    const duplicate = await request(app).post('/api/favorites').send({ characterId: 1 });
    expect(duplicate.status).toBe(409);

    const listed = await request(app).get('/api/favorites');
    expect(listed.status).toBe(200);
    expect(listed.body.data[0].character.name).toBe('Rick Sanchez');

    const removed = await request(app).delete('/api/favorites/1');
    expect(removed.status).toBe(204);
  });
});
