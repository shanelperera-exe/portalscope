import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CharacterGrid } from '../components/CharacterGrid';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SearchBar } from '../components/SearchBar';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { listCharacters } from '../services/characterApi';

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const featured = useAsyncResource(() => listCharacters({ page: 1 }), []);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const name = query.trim();
    navigate(name ? `/characters?name=${encodeURIComponent(name)}` : '/characters');
  }

  return (
    <section>
      <div className="hero">
        <div>
          <p className="meta">PortalScope · Harbor workload</p>
          <h1>Chart every dimension without leaving the citadel.</h1>
          <p className="lede">
            Browse Rick and Morty characters, locations, and episodes through a dedicated explorer
            API. Save a demo collection of favorites and watch health checks keep the portal honest.
          </p>
          <form className="toolbar" onSubmit={onSearch}>
            <SearchBar value={query} onChange={setQuery} placeholder="Search for Rick, Morty, Summer..." />
            <button className="btn" type="submit">
              Open portal
            </button>
          </form>
        </div>
        <div className="portal-panel" aria-hidden="true" />
      </div>
      <div className="quick-links">
        <Link className="quick-link" to="/characters">
          <h3>Characters</h3>
          <p className="meta">Search, filter, and inspect every known being.</p>
        </Link>
        <Link className="quick-link" to="/locations">
          <h3>Locations</h3>
          <p className="meta">Jump across planets, citadels, and pocket dimensions.</p>
        </Link>
        <Link className="quick-link" to="/episodes">
          <h3>Episodes</h3>
          <p className="meta">Track air dates and the characters who showed up.</p>
        </Link>
      </div>
      <h2>Featured travelers</h2>
      {featured.loading ? <LoadingState /> : null}
      {featured.error ? <ErrorState message={featured.error} onRetry={featured.reload} /> : null}
      {featured.data ? <CharacterGrid characters={featured.data.data.slice(0, 8)} /> : null}
    </section>
  );
}
