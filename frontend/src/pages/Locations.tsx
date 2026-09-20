import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { listLocations } from '../services/locationApi';

export function LocationsPage() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const debouncedName = useDebouncedValue(name);
  const result = useAsyncResource(
    () => listLocations(page, debouncedName.trim() || undefined),
    [page, debouncedName],
  );

  return (
    <section>
      <h1>Locations</h1>
      <div className="toolbar">
        <SearchBar
          value={name}
          onChange={(value) => {
            setName(value);
            setPage(1);
          }}
          placeholder="Search locations"
        />
      </div>
      {result.loading ? <LoadingState /> : null}
      {result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : null}
      {result.data && result.data.data.length === 0 ? (
        <EmptyState message="No locations matching your search were found." />
      ) : null}
      {result.data?.data.map((location) => (
        <Link className="panel list-card" key={location.id} to={`/locations/${location.id}`}>
          <div>
            <h3>{location.name}</h3>
            <p className="meta">
              {location.type} · {location.dimension}
            </p>
          </div>
          <span className="meta">{location.residentCount} residents</span>
        </Link>
      ))}
      {result.data ? (
        <Pagination page={result.data.pagination.page} pages={result.data.pagination.pages} onPage={setPage} />
      ) : null}
    </section>
  );
}
