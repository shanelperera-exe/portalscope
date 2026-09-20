import type { RickAndMortyClient } from '../clients/rickAndMorty.client.js';
import type { Character, Paginated } from '../types/domain.js';
import type { CharacterQuery } from '../utils/validators.js';
import { toCharacter } from '../utils/transformers.js';

export class CharacterService {
  constructor(private readonly client: RickAndMortyClient) {}

  async list(query: CharacterQuery): Promise<Paginated<Character>> {
    const response = await this.client.listCharacters({
      page: query.page,
      name: query.name,
      status: query.status,
      species: query.species,
      gender: query.gender,
    });

    return {
      data: response.results.map(toCharacter),
      pagination: {
        page: query.page ?? 1,
        pages: response.info.pages,
        count: response.info.count,
      },
    };
  }

  async getById(id: number): Promise<Character> {
    const character = await this.client.getCharacter(id);
    return toCharacter(character);
  }

  async getByIds(ids: number[]): Promise<Character[]> {
    const characters = await this.client.getCharacters(ids);
    return characters.map(toCharacter);
  }
}
