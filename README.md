# Interdimensional Explorer

Rick and Morty character, location, and episode explorer used as a small Harbor test workload.

The browser talks only to the Node.js API. The API talks to the public Rick and Morty API and stores demo-user favorites in PostgreSQL.

## Architecture

```
Browser (React + Vite)
        │
        ▼
Backend (Express)
   ┌────┴────┐
   ▼         ▼
Rick & Morty API   PostgreSQL
```

## Technology stack

- Frontend: React, Vite, TypeScript, React Router
- Backend: Node.js, Express, TypeScript, Zod, Prisma
- Database: PostgreSQL
- Tests: Vitest, React Testing Library, Supertest, Playwright
- Containers: Docker Compose, Nginx, multi-stage images

## Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose (recommended)

## Local setup

```bash
cp .env.example .env
npm install
```

Start PostgreSQL (Docker is easiest):

```bash
docker compose up postgres -d
cd backend && npx prisma migrate deploy && cd ..
```

Then run the apps:

```bash
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API docs: http://localhost:3000/api-docs

The Vite dev server proxies `/api` to the backend.

## Environment variables

See `.env.example`.

| Variable | Used by | Description |
| --- | --- | --- |
| `PORT` | backend | API port (default `3000`) |
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `RICK_AND_MORTY_API_URL` | backend | External API base URL |
| `RICK_AND_MORTY_API_TIMEOUT` | backend | Timeout in milliseconds |
| `CORS_ORIGIN` | backend | Comma-separated allowed origins |
| `ENABLE_TEST_FAILURES` | backend | QA-only simulated 500s on character list |
| `APP_VERSION` | backend | Reported service version |
| `NODE_ENV` | backend | `development`, `test`, `qa`, `staging`, or `production` |
| `VITE_API_BASE_URL` | frontend | API prefix; `/api` works with the Vite/Nginx proxy |

Never commit a real `.env` file.

## Docker setup

```bash
cp .env.example .env
docker compose up --build
```

- App: http://localhost:8080
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api-docs or http://localhost:8080/api-docs

Images are tagged `interdimensional-explorer-frontend:1.0.0` and `interdimensional-explorer-backend:1.0.0`.

## Database setup

Prisma migrations create the `User` and `Favorite` tables and insert demo user `id=1`. Authentication is intentionally out of scope; every favorite belongs to that user.

## Running tests

```bash
npm run lint
npm test
npm run test:integration -w backend
npx playwright install --with-deps chromium
E2E_BASE_URL=http://localhost:8080 npx playwright test
```

Unit and API tests mock the Rick and Morty API. End-to-end tests expect a running stack.

## API documentation

OpenAPI is served at `/api-docs`. Endpoint details are also in `docs/api.md`.

## Project structure

```
frontend/   React application
backend/    Express API, Prisma, tests
tests/e2e/  Playwright flows
docs/       Architecture, testing, deployment notes
```

## Troubleshooting

See `docs/troubleshooting.md`.

## Harbor deployment considerations

Frontend, backend, and PostgreSQL are independently deployable. Health is `GET /api/health`. Readiness is `GET /api/ready` and fails when PostgreSQL is down. External API outages return `502` without crashing the backend. Set `ENABLE_TEST_FAILURES=true` only in non-production environments to simulate a broken character listing for rollback drills.
