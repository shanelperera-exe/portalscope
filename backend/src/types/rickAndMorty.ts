export interface RickAndMortyInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RickAndMortyNamedRef {
  name: string;
  url?: string;
}

export interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: RickAndMortyNamedRef;
  location: RickAndMortyNamedRef;
  episode: string[];
}

export interface RickAndMortyLocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

export interface RickAndMortyEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export interface RickAndMortyListResponse<T> {
  info: RickAndMortyInfo;
  results: T[];
}
