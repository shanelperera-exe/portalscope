import { Link, useParams } from 'react-router-dom';
import { CharacterGrid } from '../components/CharacterGrid';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { getLocation } from '../services/locationApi';

export function LocationDetailsPage() {
  const { id } = useParams();
  const result = useAsyncResource(() => getLocation(Number(id)), [id]);

  if (result.loading) {
    return <LoadingState />;
  }
  if (result.error || !result.data) {
    return <ErrorState message={result.error ?? 'Location not found'} onRetry={result.reload} />;
  }

  const location = result.data;

  return (
    <article>
      <p className="meta">
        <Link to="/locations">Locations</Link> / {location.name}
      </p>
      <h1>{location.name}</h1>
      <p className="meta">Type: {location.type}</p>
      <p className="meta">Dimension: {location.dimension}</p>
      <h2>Residents</h2>
      {location.residents.length === 0 ? (
        <EmptyState message="No residents were found at this location." />
      ) : (
        <CharacterGrid characters={location.residents} />
      )}
    </article>
  );
}
