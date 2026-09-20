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

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residentCount: number;
  residents: Character[];
}

export interface Episode {
  id: number;
  name: string;
  episode: string;
  airDate: string;
  characterCount: number;
  characters: Character[];
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

export interface FavoriteRecord {
  id: number;
  characterId: number;
}

export interface FavoriteWithCharacter extends FavoriteRecord {
  character: Character;
}
