import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState';
import { FavoriteButton } from '../components/FavoriteButton';
import { LoadingState } from '../components/LoadingState';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { getCharacter } from '../services/characterApi';
import { addFavorite, listFavorites, removeFavorite } from '../services/favoriteApi';

export function CharacterDetailsPage() {
  const { id } = useParams();
  const characterId = Number(id);
  const character = useAsyncResource(() => getCharacter(characterId), [characterId]);
  const favorites = useAsyncResource(() => listFavorites(), [characterId]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isFavorite = Boolean(
    favorites.data?.data.some((favorite) => favorite.characterId === characterId),
  );

  async function toggleFavorite() {
    setBusy(true);
    setActionError(null);
    try {
      if (isFavorite) {
        await removeFavorite(characterId);
      } else {
        await addFavorite(characterId);
      }
      favorites.reload();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update favorites');
    } finally {
      setBusy(false);
    }
  }

  if (character.loading) {
    return <LoadingState />;
  }
  if (character.error || !character.data) {
    return <ErrorState message={character.error ?? 'Character not found'} onRetry={character.reload} />;
  }

  const data = character.data;

  return (
    <article className="details">
      <img src={data.image} alt={data.name} />
      <div>
        <p className="meta">
          <Link to="/characters">Characters</Link> / {data.name}
        </p>
        <h1>{data.name}</h1>
        <p className={`status ${data.status.toLowerCase()}`}>
          {data.status} · {data.species}
        </p>
        <p className="meta">Type: {data.type || 'Unknown'}</p>
        <p className="meta">Gender: {data.gender}</p>
        <p className="meta">Origin: {data.origin.name}</p>
        <p className="meta">Location: {data.location.name}</p>
        <p className="meta">Episode count: {data.episodeCount}</p>
        <FavoriteButton active={isFavorite} busy={busy} onToggle={() => void toggleFavorite()} />
        {actionError ? <p role="alert">{actionError}</p> : null}
      </div>
    </article>
  );
}
