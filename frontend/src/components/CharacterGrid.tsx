import type { Character } from '../types/models';
import { CharacterCard } from './CharacterCard';

export function CharacterGrid({ characters }: { characters: Character[] }) {
  return (
    <div className="card-grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
