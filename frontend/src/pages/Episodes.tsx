import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { listEpisodes } from '../services/episodeApi';

export function EpisodesPage() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const debouncedName = useDebouncedValue(name);
  const result = useAsyncResource(
    () => listEpisodes(page, debouncedName.trim() || undefined),
    [page, debouncedName],
  );

  return (
    <section>
      <h1>Episodes</h1>
      <div className="toolbar">
        <SearchBar
          value={name}
          onChange={(value) => {
            setName(value);
            setPage(1);
          }}
          placeholder="Search episodes"
        />
      </div>
      {result.loading ? <LoadingState /> : null}
      {result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : null}
      {result.data && result.data.data.length === 0 ? (
        <EmptyState message="No episodes matching your search were found." />
      ) : null}
      {result.data?.data.map((episode) => (
        <Link className="panel list-card" key={episode.id} to={`/episodes/${episode.id}`}>
          <div>
            <h3>{episode.name}</h3>
            <p className="meta">
              {episode.episode} · {episode.airDate}
            </p>
          </div>
          <span className="meta">{episode.characterCount} characters</span>
        </Link>
      ))}
      {result.data ? (
        <Pagination page={result.data.pagination.page} pages={result.data.pagination.pages} onPage={setPage} />
      ) : null}
    </section>
  );
}
