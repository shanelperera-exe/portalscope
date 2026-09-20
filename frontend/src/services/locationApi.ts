import { api } from './api';
import type { LocationDetails, LocationSummary, Paginated } from '../types/models';

export function listLocations(page = 1, name?: string): Promise<Paginated<LocationSummary>> {
  const params = new URLSearchParams({ page: String(page) });
  if (name) {
    params.set('name', name);
  }
  return api.get(`/locations?${params.toString()}`);
}

export function getLocation(id: number): Promise<LocationDetails> {
  return api.get(`/locations/${id}`);
}
