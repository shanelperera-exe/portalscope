import { useState } from 'react';
import { CharacterCard } from '../components/CharacterCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { listFavorites, removeFavorite } from '../services/favoriteApi';

export function FavoritesPage() {
  const result = useAsyncResource(() => listFavorites(), []);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function remove(characterId: number) {
    setBusyId(characterId);
    try {
      await removeFavorite(characterId);
      result.reload();
    } finally {
      setBusyId(null);
    }
  }

  if (result.loading) {
    return <LoadingState />;
  }
  if (result.error) {
    return <ErrorState message={result.error} onRetry={result.reload} />;
  }

  const favorites = result.data?.data ?? [];
  if (favorites.length === 0) {
    return <EmptyState message="Your portal collection is empty." />;
  }

  return (
    <section>
      <h1>Favorites</h1>
      <div className="card-grid">
        {favorites.map((favorite) => (
          <div key={favorite.id}>
            <CharacterCard character={favorite.character} />
            <div style={{ marginTop: 8 }}>
              <button
                className="btn danger"
                type="button"
                disabled={busyId === favorite.characterId}
                onClick={() => void remove(favorite.characterId)}
              >
                Remove favorite
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
