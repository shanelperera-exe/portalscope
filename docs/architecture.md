# Architecture

Interdimensional Explorer is a three-component application:

1. **Frontend** — React SPA served by Vite in development and Nginx in production.
2. **Backend** — Express REST API that normalizes Rick and Morty data and stores favorites.
3. **PostgreSQL** — persistence for a single demo user and that user's favorite character IDs.

The frontend never calls `https://rickandmortyapi.com` directly. Docker Compose places the services on one network. The browser reaches the frontend; Nginx proxies `/api` to the backend; the backend reaches PostgreSQL at hostname `postgres` and the public Rick and Morty API on the internet.

Request flow:

```
Route → Controller → Service → RickAndMortyClient or FavoriteRepository
```

Health (`/api/health`) reports process liveness. Readiness (`/api/ready`) checks PostgreSQL and probes the external API, but only the database is required for a `200` ready response so character browsing can still be attempted when the external API is degraded.
