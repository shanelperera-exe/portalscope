import { Link } from 'react-router-dom';
import type { Character } from '../types/models';

export function CharacterCard({ character }: { character: Character }) {
  return (
    <Link className="card" to={`/characters/${character.id}`}>
      <img src={character.image} alt={character.name} />
      <div className="card-body">
        <h3>{character.name}</h3>
        <p className={`status ${character.status.toLowerCase()}`}>
          {character.status} · {character.species}
        </p>
        <p className="meta">{character.location.name}</p>
      </div>
    </Link>
  );
}
