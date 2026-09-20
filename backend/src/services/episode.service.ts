import type { RickAndMortyClient } from '../clients/rickAndMorty.client.js';
import type { Character, Episode, Paginated } from '../types/domain.js';
import { idsFromUrls, toCharacter, toEpisodeSummary } from '../utils/transformers.js';
import type { EpisodeQuery } from '../utils/validators.js';

export class EpisodeService {
  constructor(private readonly client: RickAndMortyClient) {}

  async list(query: EpisodeQuery): Promise<Paginated<Omit<Episode, 'characters'>>> {
    const response = await this.client.listEpisodes({
      page: query.page,
      name: query.name,
      episode: query.episode,
    });

    return {
      data: response.results.map(toEpisodeSummary),
      pagination: {
        page: query.page ?? 1,
        pages: response.info.pages,
        count: response.info.count,
      },
    };
  }

  async getById(id: number): Promise<Episode> {
    const episode = await this.client.getEpisode(id);
    const characterIds = idsFromUrls(episode.characters);
    const characters: Character[] =
      characterIds.length > 0
        ? (await this.client.getCharacters(characterIds)).map(toCharacter)
        : [];

    return {
      ...toEpisodeSummary(episode),
      characters,
    };
  }
}
