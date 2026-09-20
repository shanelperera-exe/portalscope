# Testing

## Unit

- Backend: transformers, validators, character/favorite services (`npm test -w backend`)
- Frontend: cards, loading/error states, pagination, favorite button, page workflows (`npm test -w frontend`)

## Integration / API

`npm run test:integration -w backend` exercises Express with a mocked Rick and Morty fetch implementation, including health, characters, locations, episodes, invalid IDs, 404/502 mapping, and favorite create/list/delete.

## End-to-end

Playwright specs in `tests/e2e` cover:

1. Open the app and see characters
2. Search for Rick
3. Open Rick Sanchez
4. Add Rick to favorites
5. Remove Rick from favorites

Run against Docker with:

```bash
E2E_BASE_URL=http://localhost:8080 npx playwright test
```

## Container checks

`docker compose up --build` should report healthy `postgres`, `backend`, and `frontend` services. `curl http://localhost:3000/api/health` and `curl http://localhost:8080/health` should succeed.
