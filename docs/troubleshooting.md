# Troubleshooting

**Backend exits on boot**  
`DATABASE_URL` is required. The process still listens if the first connect fails, but `/api/ready` will be `503` until PostgreSQL is reachable and migrations have run.

**Favorites return 503**  
The database is down or migrations did not apply. Check `docker compose logs backend` for Prisma errors.

**Characters return 502**  
The Rick and Morty API timed out, rejected the request, or `RICK_AND_MORTY_API_URL` is wrong. The backend should keep running.

**Frontend shows empty API errors locally**  
Start the backend on port 3000. Vite proxies `/api` only in `npm run dev`.

**Swagger looks broken**  
Open `/api-docs` on the backend origin. Helmet allows the inline scripts Swagger UI needs.

**Docker frontend cannot reach the API**  
Use the Compose file so Nginx can resolve hostname `backend`. Do not point the browser at `http://backend:3000`.

**Duplicate favorite**  
`POST /api/favorites` returns `409` when the demo user already saved that `characterId`.
