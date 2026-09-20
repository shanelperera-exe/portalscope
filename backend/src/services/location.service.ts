import type { RickAndMortyClient } from '../clients/rickAndMorty.client.js';
import type { Character, Location, Paginated } from '../types/domain.js';
import { idsFromUrls, toCharacter, toLocationSummary } from '../utils/transformers.js';
import type { LocationQuery } from '../utils/validators.js';

export class LocationService {
  constructor(private readonly client: RickAndMortyClient) {}

  async list(query: LocationQuery): Promise<Paginated<Omit<Location, 'residents'>>> {
    const response = await this.client.listLocations({
      page: query.page,
      name: query.name,
      type: query.type,
      dimension: query.dimension,
    });

    return {
      data: response.results.map(toLocationSummary),
      pagination: {
        page: query.page ?? 1,
        pages: response.info.pages,
        count: response.info.count,
      },
    };
  }

  async getById(id: number): Promise<Location> {
    const location = await this.client.getLocation(id);
    const residentIds = idsFromUrls(location.residents);
    const residents: Character[] =
      residentIds.length > 0
        ? (await this.client.getCharacters(residentIds)).map(toCharacter)
        : [];

    return {
      ...toLocationSummary(location),
      residents,
    };
  }
}
