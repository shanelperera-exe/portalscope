export interface NamedRef {
  name: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: NamedRef;
  location: NamedRef;
  episodeCount: number;
}

export interface Pagination {
  page: number;
  pages: number;
  count: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export interface LocationSummary {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residentCount: number;
}

export interface LocationDetails extends LocationSummary {
  residents: Character[];
}

export interface EpisodeSummary {
  id: number;
  name: string;
  episode: string;
  airDate: string;
  characterCount: number;
}

export interface EpisodeDetails extends EpisodeSummary {
  characters: Character[];
}

export interface Favorite {
  id: number;
  characterId: number;
  character: Character;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
