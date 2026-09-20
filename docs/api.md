# API

Interactive docs: `/api-docs`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | Liveness. `{ status, service, timestamp, version }` |
| GET | `/api/ready` | `{ status, database, externalApi }`. `503` if the database is down. |
| GET | `/api/characters` | Query: `page`, `name`, `status`, `species`, `gender` |
| GET | `/api/characters/:id` | Normalized character |
| GET | `/api/locations` | Query: `page`, `name`, `type`, `dimension` |
| GET | `/api/locations/:id` | Includes resident characters |
| GET | `/api/episodes` | Query: `page`, `name`, `episode` |
| GET | `/api/episodes/:id` | Includes appearing characters |
| GET | `/api/favorites` | Demo-user favorites with character payloads |
| POST | `/api/favorites` | Body `{ "characterId": 1 }` → `201` or `409` |
| DELETE | `/api/favorites/:characterId` | `204` |

List responses:

```json
{
  "data": [],
  "pagination": { "page": 1, "pages": 42, "count": 826 }
}
```

Error body:

```json
{ "error": "External API unavailable", "code": "EXTERNAL_API_ERROR" }
```

Status codes: `400` invalid input, `404` missing resource, `409` duplicate favorite, `500` internal, `502` external API, `503` dependency unavailable.
