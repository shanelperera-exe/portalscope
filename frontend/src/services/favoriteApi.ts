import { api } from './api';
import type { Favorite } from '../types/models';

export function listFavorites(): Promise<{ data: Favorite[] }> {
  return api.get('/favorites');
}

export function addFavorite(characterId: number): Promise<{ id: number; characterId: number }> {
  return api.post('/favorites', { characterId });
}

export function removeFavorite(characterId: number): Promise<void> {
  return api.delete(`/favorites/${characterId}`);
}
