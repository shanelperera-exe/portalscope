import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CharacterGrid } from '../components/CharacterGrid';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { listCharacters } from '../services/characterApi';

export function CharactersPage() {
  const [params, setParams] = useSearchParams();
  const [name, setName] = useState(params.get('name') ?? '');
  const [status, setStatus] = useState(params.get('status') ?? '');
  const [species, setSpecies] = useState(params.get('species') ?? '');
  const [gender, setGender] = useState(params.get('gender') ?? '');
  const page = Number(params.get('page') ?? '1');
  const debouncedName = useDebouncedValue(name);

  const filters = useMemo(
    () => ({ page, name: debouncedName.trim(), status, species, gender }),
    [page, debouncedName, status, species, gender],
  );

  const result = useAsyncResource(() => listCharacters(filters), [filters]);

  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        merged.set(key, value);
      } else {
        merged.delete(key);
      }
    });
    if (!next.page) {
      merged.set('page', '1');
    }
    setParams(merged);
  }

  return (
    <section>
      <h1>Characters</h1>
      <div className="toolbar">
        <SearchBar
          value={name}
          onChange={(value) => {
            setName(value);
            update({ name: value, page: '1' });
          }}
          placeholder="Search by name"
        />
      </div>
      <FilterPanel
        status={status}
        species={species}
        gender={gender}
        onStatus={(value) => {
          setStatus(value);
          update({ status: value });
        }}
        onSpecies={(value) => {
          setSpecies(value);
          update({ species: value });
        }}
        onGender={(value) => {
          setGender(value);
          update({ gender: value });
        }}
      />
      {result.loading ? <LoadingState /> : null}
      {result.error ? (
        <ErrorState
          message="Oops! The portal is unstable. We couldn't retrieve the characters right now."
          onRetry={result.reload}
        />
      ) : null}
      {result.data && result.data.data.length === 0 ? (
        <EmptyState message="No beings matching your search were found." />
      ) : null}
      {result.data && result.data.data.length > 0 ? (
        <>
          <CharacterGrid characters={result.data.data} />
          <Pagination
            page={result.data.pagination.page}
            pages={result.data.pagination.pages}
            onPage={(nextPage) => update({ page: String(nextPage) })}
          />
        </>
      ) : null}
    </section>
  );
}
