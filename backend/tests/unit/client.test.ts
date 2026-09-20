import { describe, expect, it, vi } from 'vitest';
import { RickAndMortyClient } from '../../src/clients/rickAndMorty.client.js';
import type { AppEnv } from '../../src/config/env.js';
import { ExternalApiError } from '../../src/utils/errors.js';

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

describe('RickAndMortyClient', () => {
  it('maps network failures to ExternalApiError', async () => {
    const client = new RickAndMortyClient(env, vi.fn().mockRejectedValue(new Error('timeout')));
    await expect(client.getCharacter(1)).rejects.toBeInstanceOf(ExternalApiError);
  });
});
