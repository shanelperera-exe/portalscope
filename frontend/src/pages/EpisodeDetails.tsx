import { Link, useParams } from 'react-router-dom';
import { CharacterGrid } from '../components/CharacterGrid';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { getEpisode } from '../services/episodeApi';

export function EpisodeDetailsPage() {
  const { id } = useParams();
  const result = useAsyncResource(() => getEpisode(Number(id)), [id]);

  if (result.loading) {
    return <LoadingState />;
  }
  if (result.error || !result.data) {
    return <ErrorState message={result.error ?? 'Episode not found'} onRetry={result.reload} />;
  }

  const episode = result.data;

  return (
    <article>
      <p className="meta">
        <Link to="/episodes">Episodes</Link> / {episode.name}
      </p>
      <h1>{episode.name}</h1>
      <p className="meta">{episode.episode}</p>
      <p className="meta">Air date: {episode.airDate}</p>
      <h2>Characters</h2>
      <CharacterGrid characters={episode.characters} />
    </article>
  );
}
