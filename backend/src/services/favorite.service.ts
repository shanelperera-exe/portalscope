import type { CharacterService } from './character.service.js';
import type { FavoriteRepository } from '../repositories/favorite.repository.js';
import type { FavoriteRecord, FavoriteWithCharacter } from '../types/domain.js';
import { log } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export class FavoriteService {
  constructor(
    private readonly favorites: FavoriteRepository,
    private readonly characters: CharacterService,
  ) {}

  async list(): Promise<FavoriteWithCharacter[]> {
    const records = await this.favorites.list();
    if (records.length === 0) {
      return [];
    }

    const characters = await this.characters.getByIds(records.map((record) => record.characterId));
    const byId = new Map(characters.map((character) => [character.id, character]));

    return records.flatMap((record) => {
      const character = byId.get(record.characterId);
      if (!character) {
        return [];
      }
      return [
        {
          id: record.id,
          characterId: record.characterId,
          character,
        },
      ];
    });
  }

  async add(characterId: number): Promise<FavoriteRecord> {
    await this.characters.getById(characterId);
    const favorite = await this.favorites.create(characterId);
    log('INFO', 'Favorite created', { characterId, favoriteId: favorite.id });
    return { id: favorite.id, characterId: favorite.characterId };
  }

  async remove(characterId: number): Promise<void> {
    const removed = await this.favorites.deleteByCharacterId(characterId);
    if (!removed) {
      throw new NotFoundError('Favorite not found');
    }
  }
}
