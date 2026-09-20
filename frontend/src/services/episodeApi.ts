import { api } from './api';
import type { EpisodeDetails, EpisodeSummary, Paginated } from '../types/models';

export function listEpisodes(page = 1, name?: string): Promise<Paginated<EpisodeSummary>> {
  const params = new URLSearchParams({ page: String(page) });
  if (name) {
    params.set('name', name);
  }
  return api.get(`/episodes?${params.toString()}`);
}

export function getEpisode(id: number): Promise<EpisodeDetails> {
  return api.get(`/episodes/${id}`);
}
