import type { Character, Episode, Location } from '../types/domain.js';
import type {
  RickAndMortyCharacter,
  RickAndMortyEpisode,
  RickAndMortyLocation,
} from '../types/rickAndMorty.js';

export function toCharacter(character: RickAndMortyCharacter): Character {
  return {
    id: character.id,
    name: character.name,
    status: character.status,
    species: character.species,
    type: character.type,
    gender: character.gender,
    image: character.image,
    origin: { name: character.origin.name },
    location: { name: character.location.name },
    episodeCount: character.episode.length,
  };
}

export function toLocationSummary(location: RickAndMortyLocation): Omit<Location, 'residents'> {
  return {
    id: location.id,
    name: location.name,
    type: location.type,
    dimension: location.dimension,
    residentCount: location.residents.length,
  };
}

export function toEpisodeSummary(episode: RickAndMortyEpisode): Omit<Episode, 'characters'> {
  return {
    id: episode.id,
    name: episode.name,
    episode: episode.episode,
    airDate: episode.air_date,
    characterCount: episode.characters.length,
  };
}

export function idsFromUrls(urls: string[]): number[] {
  return urls
    .map((url) => {
      const match = url.match(/\/(\d+)\/?$/);
      return match ? Number(match[1]) : NaN;
    })
    .filter((id) => Number.isInteger(id) && id > 0);
}
