import type { AppEnv } from '../config/env.js';
import type { RickAndMortyListResponse } from '../types/rickAndMorty.js';
import {
  rickAndMortyCharacterSchema,
  rickAndMortyEpisodeSchema,
  rickAndMortyListSchema,
  rickAndMortyLocationSchema,
} from '../types/rickAndMorty.schema.js';
import type {
  RickAndMortyCharacter,
  RickAndMortyEpisode,
  RickAndMortyLocation,
} from '../types/rickAndMorty.js';
import { ExternalApiError, NotFoundError } from '../utils/errors.js';
import { log } from '../utils/logger.js';

export class RickAndMortyClient {
  constructor(private readonly env: AppEnv, private readonly fetchImpl: typeof fetch = fetch) {}

  async getCharacter(id: number): Promise<RickAndMortyCharacter> {
    return this.getResource(`/character/${id}`, rickAndMortyCharacterSchema);
  }

  async getCharacters(ids: number[]): Promise<RickAndMortyCharacter[]> {
    if (ids.length === 0) {
      return [];
    }
    const data = await this.getJson(`/character/${ids.join(',')}`);
    const parsed = rickAndMortyCharacterSchema.array().or(rickAndMortyCharacterSchema).parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  async listCharacters(
    query: Record<string, string | number | undefined>,
  ): Promise<RickAndMortyListResponse<RickAndMortyCharacter>> {
    return this.getList(
      `/character${toQueryString(query)}`,
      rickAndMortyListSchema(rickAndMortyCharacterSchema),
    );
  }

  async getLocation(id: number): Promise<RickAndMortyLocation> {
    return this.getResource(`/location/${id}`, rickAndMortyLocationSchema);
  }

  async listLocations(
    query: Record<string, string | number | undefined>,
  ): Promise<RickAndMortyListResponse<RickAndMortyLocation>> {
    return this.getList(
      `/location${toQueryString(query)}`,
      rickAndMortyListSchema(rickAndMortyLocationSchema),
    );
  }

  async getEpisode(id: number): Promise<RickAndMortyEpisode> {
    return this.getResource(`/episode/${id}`, rickAndMortyEpisodeSchema);
  }

  async listEpisodes(
    query: Record<string, string | number | undefined>,
  ): Promise<RickAndMortyListResponse<RickAndMortyEpisode>> {
    return this.getList(
      `/episode${toQueryString(query)}`,
      rickAndMortyListSchema(rickAndMortyEpisodeSchema),
    );
  }

  async ping(): Promise<boolean> {
    try {
      await this.request('/');
      return true;
    } catch {
      return false;
    }
  }

  private async getList<T>(
    path: string,
    schema: { parse: (data: unknown) => T },
  ): Promise<T> {
    try {
      return await this.getResource(path, schema);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return schema.parse({
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        });
      }
      throw error;
    }
  }

  private async getResource<T>(path: string, schema: { parse: (data: unknown) => T }): Promise<T> {
    const data = await this.getJson(path);
    try {
      return schema.parse(data);
    } catch {
      throw new ExternalApiError('Unexpected external API response');
    }
  }

  private cache = new Map<string, { data: unknown; expires: number }>();

  private async getJson(path: string): Promise<unknown> {
    const now = Date.now();
    const cached = this.cache.get(path);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const response = await this.request(path);
    try {
      const data = await response.json();
      this.cache.set(path, { data, expires: now + 60000 }); // Cache for 1 minute
      return data;
    } catch {
      throw new ExternalApiError('Unexpected external API response');
    }
  }

  private async request(path: string): Promise<Response> {
    const url = `${this.env.RICK_AND_MORTY_API_URL.replace(/\/$/, '')}${path}`;
    log('INFO', 'Rick and Morty API request', { route: path });

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        signal: AbortSignal.timeout(this.env.RICK_AND_MORTY_API_TIMEOUT),
      });
    } catch (error) {
      log('WARN', 'External API unavailable', {
        route: path,
        reason: error instanceof Error ? error.name : 'unknown',
      });
      throw new ExternalApiError();
    }

    if (response.status === 404) {
      throw new NotFoundError('Resource not found');
    }

    if (!response.ok) {
      log('WARN', 'External API unavailable', { route: path, status: response.status });
      throw new ExternalApiError();
    }

    return response;
  }
}

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const serialized = params.toString();
  return serialized ? `/?${serialized}` : '';
}
