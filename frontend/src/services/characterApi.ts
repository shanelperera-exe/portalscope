import { api } from './api';
import type { Character, Paginated } from '../types/models';

export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export function listCharacters(filters: CharacterFilters = {}): Promise<Paginated<Character>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return api.get(`/characters${query ? `?${query}` : ''}`);
}

export function getCharacter(id: number): Promise<Character> {
  return api.get(`/characters/${id}`);
}
