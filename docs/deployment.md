# Deployment

Build independently:

```bash
docker build -t interdimensional-explorer-backend:1.0.0 ./backend
docker build -t interdimensional-explorer-frontend:1.0.0 ./frontend
```

Run with Compose for a full stack, or deploy the two images plus managed PostgreSQL.

Required backend environment:

- `DATABASE_URL` using the database hostname, not `localhost`, from inside a container
- `RICK_AND_MORTY_API_URL`
- `RICK_AND_MORTY_API_TIMEOUT`
- `CORS_ORIGIN` if the UI is on a different origin than the API
- `NODE_ENV=production`
- `ENABLE_TEST_FAILURES=false`

The frontend image bakes `VITE_API_BASE_URL` at build time. The Compose setup uses `/api` and Nginx proxying so the browser stays same-origin.

Harbor scenarios:

- Promote `frontend:1.0.0` / `backend:1.0.0` independently
- Point `RICK_AND_MORTY_API_URL` at an invalid host to test `502` + readiness `externalApi: unavailable`
- Stop PostgreSQL to fail `/api/ready` while `/api/health` still returns `ok`
- Set `ENABLE_TEST_FAILURES=true` in QA only to force `GET /api/characters` to `500`
