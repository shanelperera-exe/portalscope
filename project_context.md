# INTERDIMENSIONAL EXPLORER

## Complete Project Context & A–Z Implementation Guide

---

# 1. PROJECT OVERVIEW

Build a small full-stack web application called **Interdimensional Explorer**.

The application is a Rick and Morty themed character, location, and episode explorer powered by the public **Rick and Morty API**.

The application is NOT intended to be a large production system. It is intentionally small and is being developed primarily as a **test workload for the Harbor platform**.

The application must therefore be:

* Simple to understand
* Easy to Dockerize
* Easy to deploy
* Easy to test
* Easy to break intentionally
* Easy to roll back
* Composed of independently deployable components
* Realistic enough to exercise Harbor's deployment and QA capabilities

The application should feel like a polished small product, not a prototype with an ugly or unfinished UI.

---

# 2. PRIMARY OBJECTIVE

The primary objective is to create a small realistic application that Harbor can build, deploy, monitor, test, update, and roll back.

The application itself is secondary to Harbor.

The application must provide enough complexity to test:

* Docker image creation
* Multiple services
* Environment variables
* CI/CD
* Deployment
* Health checks
* Service-to-service communication
* External API integration
* Database connectivity
* Integration testing
* End-to-end testing
* Failure handling
* Logs
* Versioning
* Rollbacks
* QA environments
* Staging environments
* Production-like deployment

Do NOT over-engineer the application.

---

# 3. APPLICATION CONCEPT

The application is an **Interdimensional Explorer**.

Users can explore the Rick and Morty universe.

Main functionality:

1. Browse characters
2. Search characters
3. Filter characters
4. View character details
5. Explore locations
6. View location residents
7. Browse episodes
8. View episode details
9. Add characters to favorites
10. Remove characters from favorites
11. View saved favorites
12. Display system/API health information

---

# 4. EXTERNAL API

Use the public Rick and Morty API:

https://rickandmortyapi.com/api

The backend must communicate with this API.

Do NOT make the frontend directly depend on the external API.

The architecture should be:

Frontend -> Backend -> Rick and Morty API

This is intentional.

The backend acts as the application's API layer and external API integration layer.

---

# 5. IMPORTANT API ENDPOINTS

The Rick and Morty API provides the following major resources.

## Characters

Base endpoint:

GET /character

Individual character:

GET /character/{id}

Search/filter example:

GET /character/?name=rick

GET /character/?status=alive

GET /character/?species=human

GET /character/?gender=male

Pagination:

GET /character/?page=2

---

## Locations

GET /location

GET /location/{id}

---

## Episodes

GET /episode

GET /episode/{id}

---

# 6. HIGH-LEVEL ARCHITECTURE

Use this architecture:

```
                ┌─────────────────────────┐
                │       Browser           │
                │                         │
                │   React + Vite         │
                └────────────┬────────────┘
                             │
                             │ HTTP
                             ▼
                ┌─────────────────────────┐
                │       Backend API        │
                │                         │
                │   Node.js + Express     │
                └────────────┬────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
   ┌────────────────────┐       ┌────────────────────┐
   │ Rick and Morty API │       │    PostgreSQL      │
   │ External Service   │       │                    │
   └────────────────────┘       │ Favorite data      │
                                └────────────────────┘
```

There are three application components:

1. Frontend
2. Backend
3. PostgreSQL database

There is also one external dependency:

4. Rick and Morty API

---

# 7. TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason not to.

## Frontend

* React
* Vite
* TypeScript
* React Router
* Axios or native fetch
* CSS / CSS modules / Tailwind

Prefer a simple styling solution.

Do NOT introduce a large UI framework unless necessary.

---

## Backend

* Node.js
* Express
* TypeScript
* Axios or native fetch
* Zod or similar validation library if needed

Use REST APIs.

---

## Database

PostgreSQL.

Use a lightweight database library/ORM such as:

* Prisma
* Drizzle
* node-postgres

Prefer Prisma if it makes development easier.

---

## Testing

Frontend:

* Vitest
* React Testing Library

Backend:

* Jest or Vitest
* Supertest

E2E:

* Playwright

---

## Containerization

Use Docker.

Each deployable component should have its own Dockerfile.

---

# 8. PROJECT STRUCTURE

Use a monorepo.

Recommended structure:

interdimensional-explorer/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── layouts/
│   │   └── App.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── tests/
│   └── e2e/
│
├── docker-compose.yml
├── docker-compose.test.yml
├── .env.example
├── .gitignore
├── README.md
└── docs/

---

# 9. FRONTEND RESPONSIBILITIES

The frontend is responsible for:

* User interface
* Navigation
* Search
* Filtering
* Pagination
* Displaying characters
* Displaying locations
* Displaying episodes
* Character details
* Location details
* Episode details
* Favorites UI
* Loading states
* Error states
* Empty states

The frontend must NOT directly call the Rick and Morty API.

All application data requests must go through the backend.

---

# 10. FRONTEND PAGES

Implement the following pages.

## Home

Route:

/

Content:

* Application introduction
* Search bar
* Quick links
* Featured/random characters
* Navigation to Characters, Locations and Episodes

---

## Characters

Route:

/characters

Features:

* Character grid
* Search
* Filters
* Pagination
* Loading state
* Error state
* Empty state

Filters:

* Status
* Species
* Gender

Character card should show:

* Image
* Name
* Status
* Species
* Location

---

## Character Details

Route:

/characters/:id

Display:

* Character image
* Name
* Status
* Species
* Type
* Gender
* Origin
* Current location
* Episode count
* Favorite button

Favorite button:

* Add to favorites
* Remove from favorites

---

## Locations

Route:

/locations

Display:

* Location name
* Type
* Dimension
* Resident count

Support pagination.

---

## Location Details

Route:

/locations/:id

Display:

* Location name
* Type
* Dimension
* Residents

Residents should be clickable and navigate to character details.

---

## Episodes

Route:

/episodes

Display:

* Episode name
* Episode code
* Air date
* Character count

Support pagination.

---

## Episode Details

Route:

/episodes/:id

Display:

* Episode name
* Episode code
* Air date
* List of characters appearing in the episode

Character names should link to character details.

---

## Favorites

Route:

/favorites

Display:

* User's favorite characters
* Character cards
* Remove favorite button
* Empty-state message

For this small project, authentication is NOT required.

Use a simple demo-user concept.

All favorites can belong to a single default/demo user.

---

# 11. BACKEND RESPONSIBILITIES

The backend is responsible for:

* REST API
* External Rick and Morty API integration
* Database interaction
* Input validation
* Error handling
* Logging
* Health checks
* Favorites

Backend structure should follow a simple layered architecture:

Routes
↓
Controllers
↓
Services
↓
Repositories / external API clients
↓
Database / external API

Do not create unnecessary abstractions.

---

# 12. BACKEND API

Expose these endpoints.

## Health

GET /api/health

Example response:

{
"status": "ok",
"service": "interdimensional-explorer-backend",
"timestamp": "2026-09-20T00:00:00.000Z"
}

---

## Readiness

GET /api/ready

This endpoint should verify that required dependencies are available.

Example:

{
"status": "ready",
"database": "ok",
"externalApi": "ok"
}

If the database is unavailable, readiness should indicate failure.

---

# 13. CHARACTER API

GET /api/characters

Supported query parameters:

* page
* name
* status
* species
* gender

Example:

GET /api/characters?page=1&name=rick&status=alive

Backend calls:

https://rickandmortyapi.com/api/character

and passes appropriate query parameters.

---

GET /api/characters/:id

Returns a single character.

---

# 14. LOCATION API

GET /api/locations

Supported:

* page
* name
* type
* dimension

---

GET /api/locations/:id

Returns one location.

---

# 15. EPISODE API

GET /api/episodes

Supported:

* page
* name
* episode

---

GET /api/episodes/:id

Returns one episode.

---

# 16. FAVORITES API

Use a simple demo-user model.

GET /api/favorites

Returns favorite characters.

POST /api/favorites

Request:

{
"characterId": 1
}

Response:

{
"id": 1,
"characterId": 1
}

DELETE /api/favorites/:characterId

Removes the character from favorites.

---

# 17. DATABASE

Use PostgreSQL.

For the MVP, the database only needs to store favorites.

Suggested schema:

User:

id
createdAt

Favorite:

id
userId
characterId
createdAt

Relationships:

User 1 ---- * Favorite

Do not store complete Rick and Morty character data unless there is a clear reason.

The external API remains the source of truth for character data.

---

# 18. DEMO USER

Do not implement authentication.

Create a default user during database initialization.

Example:

User:

id = 1

The backend can use this user for all favorite operations.

This is intentional because authentication is outside the scope of this test application.

---

# 19. ERROR HANDLING

The backend must handle:

* Rick and Morty API unavailable
* Rick and Morty API timeout
* Rick and Morty API returns 404
* Rick and Morty API returns 500
* Database unavailable
* Invalid character ID
* Invalid location ID
* Invalid episode ID
* Invalid favorite request
* Duplicate favorite

Use appropriate HTTP status codes.

Examples:

400 = invalid request

404 = resource not found

409 = duplicate favorite

500 = internal error

502 = external API failure

503 = dependency unavailable

---

# 20. EXTERNAL API TIMEOUT

The backend must use a timeout when calling the Rick and Morty API.

Do not allow an external request to hang indefinitely.

Recommended timeout:

5000 ms

If the external API does not respond within the timeout:

Return an appropriate error response.

Example:

{
"error": "External API unavailable",
"code": "EXTERNAL_API_ERROR"
}

---

# 21. ENVIRONMENT VARIABLES

Backend:

PORT=3000

DATABASE_URL=postgresql://...

RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api

RICK_AND_MORTY_API_TIMEOUT=5000

NODE_ENV=development

Frontend:

VITE_API_BASE_URL=http://localhost:3000/api

Never hard-code environment-specific URLs.

---

# 22. DOCKER

The project must be fully Dockerized.

Services:

frontend
backend
postgres

Docker Compose should allow the entire system to start with:

docker compose up --build

Expected result:

Frontend available on localhost.

Backend available on localhost.

PostgreSQL available internally.

---

# 23. DOCKER NETWORK

Frontend and backend should communicate through the Docker Compose network.

Backend connects to PostgreSQL using the PostgreSQL service name.

Example:

DATABASE_URL=postgresql://user:password@postgres:5432/interdimensional_explorer

Do not use localhost for inter-container communication.

---

# 24. DOCKER HEALTH CHECKS

Implement health checks.

Backend:

GET /api/health

PostgreSQL:

Use PostgreSQL's standard readiness/health command.

Frontend:

Use an appropriate lightweight health check.

Docker Compose should depend on database readiness where appropriate.

---

# 25. FRONTEND UX

The UI should have a polished sci-fi / interdimensional theme.

Do NOT simply copy the exact Rick and Morty website.

Use an original design inspired by:

* Space
* Portals
* Dimensions
* Sci-fi dashboards

Suggested visual direction:

Dark background

Portal-inspired gradients

Green/cyan accents

Card-based character explorer

Rounded components

Subtle animations

Responsive layout

---

# 26. RESPONSIVE DESIGN

The application must work on:

* Desktop
* Tablet
* Mobile

Character cards should automatically adapt to screen width.

Navigation should collapse on mobile.

---

# 27. LOADING STATES

Every API-driven page must show a loading state.

Examples:

Skeleton cards

Loading spinner

"Exploring the multiverse..." message

Do not leave blank screens while requests are loading.

---

# 28. ERROR STATES

If the API fails:

Show a friendly message.

Example:

"Oops! The portal is unstable. We couldn't retrieve the characters right now."

Provide:

[Try Again]

Do not expose raw stack traces to the user.

---

# 29. EMPTY STATES

Examples:

No characters found:

"No beings matching your search were found."

No favorites:

"Your portal collection is empty."

---

# 30. API RESPONSE NORMALIZATION

The backend should avoid exposing unnecessary raw external API structure where practical.

Normalize responses into application-friendly objects.

Example character:

{
"id": 1,
"name": "Rick Sanchez",
"status": "Alive",
"species": "Human",
"type": "",
"gender": "Male",
"image": "...",
"origin": {
"name": "Earth (C-137)"
},
"location": {
"name": "Citadel of Ricks"
}
}

---

# 31. SECURITY

This is not a security-heavy application, but implement basic protections.

Backend:

* Helmet
* CORS configuration
* Request validation
* Rate limiting
* Safe error messages
* No secrets committed to Git
* Parameter validation
* Database parameterization through ORM/query library

Do not expose:

* DATABASE_URL
* internal errors
* stack traces
* credentials

---

# 32. LOGGING

Backend should produce useful structured logs.

Examples:

INFO Request received
INFO Rick and Morty API request
INFO Favorite created
WARN External API unavailable
ERROR Database connection failed

Do not log secrets.

Include:

* timestamp
* log level
* HTTP method
* route
* response status
* request duration

---

# 33. TESTING STRATEGY

Testing is important because this application exists partly to test Harbor.

Implement:

1. Unit tests
2. Backend integration tests
3. Frontend component tests
4. E2E tests
5. API tests
6. Docker/container tests

---

# 34. UNIT TESTS

Test:

* Character service
* Favorite service
* Input validation
* Error handling
* API response transformation

Examples:

Character response is transformed correctly.

Duplicate favorite is rejected.

Invalid ID is handled.

---

# 35. BACKEND INTEGRATION TESTS

Test:

GET /api/health

GET /api/characters

GET /api/characters/1

GET /api/locations

GET /api/episodes

POST /api/favorites

GET /api/favorites

DELETE /api/favorites/:id

Use a test database or isolated database.

Do not modify production/development data.

---

# 36. FRONTEND TESTS

Test:

* Character cards render
* Search works
* Filters work
* Pagination works
* Character detail page works
* Favorite button works
* Error state appears
* Loading state appears

---

# 37. E2E TESTS

Use Playwright.

Important flows:

## E2E 1

Open application.

Navigate to Characters.

Verify characters appear.

---

## E2E 2

Search for Rick.

Verify Rick Sanchez appears.

---

## E2E 3

Open Rick Sanchez.

Verify character information.

---

## E2E 4

Add Rick to favorites.

Open Favorites.

Verify Rick appears.

---

## E2E 5

Remove Rick from favorites.

Verify he disappears.

---

# 38. HARBOR TEST SCENARIOS

The application must be intentionally suitable for Harbor testing.

## Scenario 1 — Normal deployment

Deploy:

frontend:v1.0.0
backend:v1.0.0

Verify everything works.

---

## Scenario 2 — Backend update

Deploy:

backend:v1.1.0

Frontend remains unchanged.

Verify compatibility.

---

## Scenario 3 — Broken backend

Create a test version that returns 500 errors from:

GET /api/characters

Deploy it to QA.

Expected:

Frontend displays a friendly error.

QA tests fail.

Harbor deployment can then be rolled back.

---

## Scenario 4 — External API failure

Temporarily configure the backend to use an invalid external API URL.

Example:

RICK_AND_MORTY_API_URL=http://invalid-api

Expected:

Backend remains running.

Readiness/health information should identify the dependency problem.

Character requests should return an appropriate error.

---

## Scenario 5 — Database failure

Stop PostgreSQL.

Expected:

Favorites fail gracefully.

Backend health/readiness identifies database failure.

Character browsing may still work if external API is available.

---

## Scenario 6 — Environment variable test

Change:

RICK_AND_MORTY_API_URL

between environments.

Development:

real API

QA:

mock API or real API

Production:

real API

---

# 39. ENVIRONMENTS

The application should support:

Development

QA

Staging

Production

Example:

Development:

frontend -> localhost backend
backend -> Rick and Morty API
backend -> development database

QA:

frontend -> QA backend
backend -> QA database

Staging:

frontend -> staging backend
backend -> staging database

Production:

frontend -> production backend
backend -> production database

Environment-specific configuration must come from environment variables.

---

# 40. IMAGE VERSIONING

Use semantic versions.

Examples:

frontend:1.0.0
backend:1.0.0

frontend:1.1.0
backend:1.1.0

For Harbor testing, also support immutable Git commit tags if desired.

Do not rely only on "latest".

---

# 41. CI/CD EXPECTATIONS

The project should be compatible with a CI/CD pipeline.

Pipeline concept:

Git push
↓
Install dependencies
↓
Lint
↓
Unit tests
↓
Integration tests
↓
Build frontend
↓
Build backend
↓
Build Docker images
↓
Tag images
↓
Push images
↓
Deploy to QA
↓
Run E2E tests
↓
Promote to staging/production

The coding agent does not need to implement a specific CI provider unless explicitly requested.

However, the project must be structured so CI/CD can easily be added.

---

# 42. LINTING AND FORMATTING

Use ESLint.

Use Prettier.

All source code should be formatted.

Add scripts such as:

npm run lint

npm run format

npm run test

npm run build

---

# 43. NPM SCRIPTS

Frontend should provide something similar to:

npm run dev

npm run build

npm run preview

npm run test

npm run lint

Backend:

npm run dev

npm run build

npm run start

npm run test

npm run test:integration

npm run lint

---

# 44. API DOCUMENTATION

Document all backend endpoints.

Prefer OpenAPI/Swagger.

Expose:

/api-docs

Document:

* Endpoint
* Method
* Parameters
* Request body
* Response
* Error responses

This is useful for Harbor QA and API testing.

---

# 45. README

The README must explain:

1. Project overview
2. Architecture
3. Technology stack
4. Prerequisites
5. Local setup
6. Environment variables
7. Docker setup
8. Database setup
9. Running frontend
10. Running backend
11. Running tests
12. API documentation
13. Project structure
14. Troubleshooting
15. Harbor deployment considerations

---

# 46. DOCUMENTATION DIRECTORY

Create:

docs/

Recommended:

docs/
├── architecture.md
├── api.md
├── testing.md
├── deployment.md
└── troubleshooting.md

Keep documentation concise but professional.

---

# 47. DOCKER COMPOSE

Provide:

docker-compose.yml

It should start:

frontend
backend
postgres

The database should have persistent storage using a named Docker volume.

Example conceptual structure:

services:

postgres
backend
frontend

volumes:

postgres_data

---

# 48. DATABASE INITIALIZATION

The application must automatically initialize the required database schema.

Use migrations.

Do not require the developer to manually create tables.

Expected workflow:

docker compose up

database starts

migration runs

demo user exists

backend starts

frontend starts

---

# 49. BACKEND DEPENDENCY BEHAVIOR

Important:

The backend must distinguish between:

Application failure

and

Dependency failure.

If the Rick and Morty API is unavailable:

The backend process should NOT necessarily crash.

It should return a controlled error.

If PostgreSQL is unavailable:

The backend should remain understandable/observable and expose appropriate readiness information.

---

# 50. CACHING

Caching is optional.

Do NOT introduce Redis just for the sake of another service.

If caching is added, it must solve an actual problem.

For the MVP:

No Redis.

No message queue.

No authentication service.

No separate API gateway.

No Kubernetes-specific application logic.

Keep the system small.

---

# 51. PERFORMANCE

The application should be reasonably efficient.

Avoid:

* unnecessary API calls
* duplicate requests
* rendering hundreds of unnecessary cards
* blocking the frontend

Use pagination.

Do not fetch every character just to display the first page.

---

# 52. ACCESSIBILITY

Implement basic accessibility:

* semantic HTML
* alt text
* keyboard-accessible buttons
* visible focus states
* appropriate labels
* sufficient contrast
* accessible error messages

---

# 53. NO AUTHENTICATION

Do NOT implement:

* Login
* Registration
* JWT
* OAuth
* Password management

Authentication is intentionally out of scope.

Favorites use a demo user.

---

# 54. NO ADMIN PANEL

Do NOT create a large admin dashboard.

Harbor is the platform being tested.

The application should remain a normal small user-facing application.

---

# 55. NO OVERENGINEERING

Avoid:

* Microservice explosion
* Event-driven architecture
* Kafka
* RabbitMQ
* Redis
* GraphQL
* Kubernetes-specific code
* Complex authentication
* Complex authorization
* Multiple databases
* Excessive design patterns

The correct architecture is intentionally simple.

Frontend + Backend + PostgreSQL + External API.

---

# 56. EXPECTED USER FLOW

Typical user journey:

1. Open application
2. See home page
3. Navigate to Characters
4. Search for "Rick"
5. View Rick Sanchez
6. Open character details
7. Add Rick to favorites
8. Navigate to Favorites
9. See Rick
10. Navigate to Locations
11. Open a location
12. View residents
13. Navigate to Episodes
14. Open an episode
15. View characters from that episode

---

# 57. VISUAL DESIGN

Theme:

"Interdimensional sci-fi explorer"

Use an original visual identity.

Suggested:

* Dark space background
* Green/cyan portal accents
* Glass-like cards
* Subtle gradients
* Character images as primary visual elements
* Portal-inspired loading animations

Avoid excessive animations.

The application should remain professional and readable.

---

# 58. RESPONSIVENESS

Desktop:

3–5 character cards per row.

Tablet:

2–3 cards per row.

Mobile:

1–2 cards per row.

Navigation becomes mobile-friendly.

---

# 59. IMPORTANT ENGINEERING RULES

1. TypeScript strict mode should be enabled.

2. Do not use `any` unless absolutely necessary.

3. Validate external API responses where practical.

4. Validate incoming backend requests.

5. Never expose database credentials.

6. Never commit `.env`.

7. Provide `.env.example`.

8. Use meaningful error messages.

9. Use HTTP status codes correctly.

10. Keep controllers thin.

11. Keep external API communication inside a dedicated service/client.

12. Keep database access isolated.

13. Do not duplicate API logic throughout the frontend.

14. Use reusable frontend components.

15. Keep the application easy to Dockerize.

---

# 60. RECOMMENDED BACKEND STRUCTURE

backend/src/

app.ts

server.ts

config/
env.ts

routes/
health.routes.ts
character.routes.ts
location.routes.ts
episode.routes.ts
favorite.routes.ts

controllers/
character.controller.ts
location.controller.ts
episode.controller.ts
favorite.controller.ts

services/
character.service.ts
location.service.ts
episode.service.ts
favorite.service.ts

clients/
rickAndMorty.client.ts

repositories/
favorite.repository.ts

middleware/
error.middleware.ts
validation.middleware.ts

types/

utils/

This structure is recommended but should not be followed blindly if a simpler organization is more appropriate.

---

# 61. RECOMMENDED FRONTEND STRUCTURE

frontend/src/

components/

CharacterCard.tsx

CharacterGrid.tsx

SearchBar.tsx

FilterPanel.tsx

Pagination.tsx

LoadingState.tsx

ErrorState.tsx

Navbar.tsx

FavoriteButton.tsx

pages/

Home.tsx

Characters.tsx

CharacterDetails.tsx

Locations.tsx

LocationDetails.tsx

Episodes.tsx

EpisodeDetails.tsx

Favorites.tsx

services/

api.ts

characterApi.ts

locationApi.ts

episodeApi.ts

favoriteApi.ts

types/

character.ts

location.ts

episode.ts

---

# 62. API CLIENT

Create a single frontend API client.

Example conceptual usage:

api.get("/characters")

api.get("/characters/1")

api.get("/favorites")

Do not scatter raw fetch calls throughout components.

---

# 63. PAGINATION

The Rick and Morty API provides pagination information.

Backend should preserve useful pagination metadata.

Example:

{
"data": [...],
"pagination": {
"page": 1,
"pages": 42,
"count": 826
}
}

Frontend should use this metadata to render pagination controls.

---

# 64. SEARCH

Character search:

User enters:

Rick

Backend requests:

/character/?name=rick

Display matching results.

Debouncing the search input is recommended but not mandatory.

---

# 65. FILTERING

Character filters:

Status:

* Alive
* Dead
* Unknown

Gender:

* Female
* Male
* Genderless
* Unknown

Species:

Allow text search or common options.

Filters should be combined where the external API supports them.

---

# 66. FAVORITE BEHAVIOR

When user clicks Favorite:

Frontend calls:

POST /api/favorites

Backend stores:

characterId

When user opens Favorites:

Backend returns saved character IDs.

Backend can then retrieve character information from the Rick and Morty API.

Do not permanently duplicate character records in PostgreSQL for the MVP.

---

# 67. OBSERVABILITY

Provide:

GET /api/health

GET /api/ready

Logs

Request duration

HTTP status

Dependency errors

This makes the application more useful for Harbor monitoring/testing.

---

# 68. TEST FAILURE MODE

The project should make it easy to intentionally test failures.

Provide environment configuration that allows controlled failure during QA.

For example:

ENABLE_TEST_FAILURES=false

If true, an optional test-only endpoint can simulate controlled failures.

IMPORTANT:

Test failure functionality must never be enabled by default in production.

Do not create dangerous endpoints that can be accessed accidentally.

---

# 69. SECURITY OF TEST FAILURE FEATURES

If implementing failure simulation:

* Only enable in development/QA
* Disable in production
* Require an environment variable
* Never expose secrets
* Never allow arbitrary shell commands
* Never allow arbitrary code execution

---

# 70. PRODUCTION BUILD

Frontend:

Build static production assets.

Serve through a lightweight web server such as Nginx.

Backend:

Run compiled Node.js application.

Database:

PostgreSQL.

Do not run development servers in production containers.

---

# 71. DOCKER IMAGE OPTIMIZATION

Use multi-stage builds where appropriate.

Frontend:

Node build stage
↓
Nginx runtime stage

Backend:

Node build stage
↓
Node runtime stage

Do not ship unnecessary development dependencies in runtime images.

---

# 72. CONTAINER SECURITY

Containers should:

* Use non-root users where practical
* Have minimal base images
* Avoid unnecessary packages
* Use `.dockerignore`
* Avoid secrets in Dockerfiles

---

# 73. .GITIGNORE

Must include:

node_modules/

.env

dist/

coverage/

*.log

Docker-related local artifacts

IDE files

---

# 74. ENVIRONMENT FILES

Provide:

.env.example

Never commit actual secrets.

Example:

DATABASE_URL=
RICK_AND_MORTY_API_URL=https://rickandmortyapi.com/api
RICK_AND_MORTY_API_TIMEOUT=5000
PORT=3000
NODE_ENV=development

---

# 75. DEVELOPMENT COMMAND

The goal should be that a new developer can do:

git clone <repository>

cp .env.example .env

docker compose up --build

Then open the application.

The README must explain the exact process.

---

# 76. DEFINITION OF DONE

The project is complete when:

* Frontend works
* Backend works
* PostgreSQL works
* Rick and Morty API integration works
* Characters can be browsed
* Characters can be searched
* Characters can be filtered
* Character details work
* Locations work
* Episodes work
* Favorites work
* Health endpoint works
* Readiness endpoint works
* Error handling works
* Docker Compose works
* Unit tests exist
* Integration tests exist
* E2E tests exist
* Swagger/OpenAPI exists
* README exists
* Environment variables are documented
* Dockerfiles exist
* Application can be built in CI
* Application can be deployed as independent frontend/backend/database components

---

# 77. PRIORITY ORDER

Build in this order.

## Phase 1

Project setup.

Frontend.

Backend.

PostgreSQL.

Docker Compose.

---

## Phase 2

Character explorer.

Search.

Filters.

Pagination.

Character details.

---

## Phase 3

Locations.

Episodes.

Details pages.

---

## Phase 4

Favorites.

Database integration.

---

## Phase 5

Health checks.

Readiness.

Logging.

Error handling.

---

## Phase 6

Unit tests.

Integration tests.

E2E tests.

---

## Phase 7

Docker optimization.

Swagger.

Documentation.

CI/CD readiness.

---

# 78. MVP SCOPE

If development time is limited, the minimum acceptable application is:

Frontend:

* Character list
* Search
* Character details
* Favorites

Backend:

* Characters
* Character details
* Favorites
* Health

Database:

* User
* Favorites

External API:

* Rick and Morty character API

Docker:

* Frontend
* Backend
* PostgreSQL

Everything else can be added afterward.

---

# 79. WHAT NOT TO BUILD

Do NOT build:

* Authentication
* Social features
* Chat
* Real-time notifications
* Payments
* Complex user profiles
* Admin system
* Recommendation engine
* AI features
* Multiple databases
* Kubernetes operators
* Message queues
* Redis
* Kafka
* Complex microservices

The purpose is to have a small, reliable test application.

---

# 80. HARBOR RELATIONSHIP

This project is a **workload/application for Harbor**.

Harbor should be able to:

1. Receive/build application images.
2. Version images.
3. Deploy images.
4. Manage environments.
5. Run tests against the application.
6. Detect failed deployments.
7. Inspect logs.
8. Verify health.
9. Roll back versions.
10. Promote tested versions.

The test application must therefore remain stable and predictable.

---

# 81. EXPECTED DEPLOYABLE ARTIFACTS

At minimum:

interdimensional-explorer-frontend

interdimensional-explorer-backend

postgres image can use the official PostgreSQL image rather than building a custom database image.

Example:

frontend:1.0.0

backend:1.0.0

---

# 82. FUTURE HARBOR TESTING

Once the application is complete, use it to test Harbor.

Example lifecycle:

Developer changes backend.

↓

Version 1.1.0 created.

↓

CI runs tests.

↓

Docker image built.

↓

Image pushed to Harbor.

↓

QA deployment.

↓

E2E tests run.

↓

QA passes.

↓

Promote image.

↓

Deploy staging.

↓

Deploy production.

If production issue occurs:

↓

Rollback to 1.0.0.

This workflow is one of the main reasons this application exists.

---

# 83. CODING AGENT INSTRUCTIONS

You are the implementation agent.

Build the application according to this specification.

Important instructions:

1. Do not over-engineer.
2. Keep the architecture small.
3. Prioritize working functionality over unnecessary abstractions.
4. Follow TypeScript best practices.
5. Keep frontend and backend independently buildable.
6. Make Docker Compose work from a clean checkout.
7. Never hard-code environment-specific configuration.
8. Do not commit secrets.
9. Write tests alongside functionality.
10. Keep API errors predictable.
11. Keep external API calls inside backend services.
12. Do not call the Rick and Morty API directly from the browser.
13. Provide useful logs.
14. Implement health and readiness endpoints.
15. Document setup.
16. Make the project suitable for CI/CD.
17. Do not add technologies that are not necessary.
18. If there are multiple technically valid approaches, choose the simplest maintainable approach.
19. Do not expand the scope without a clear reason.
20. Keep Harbor deployment/testing in mind when designing the application.

---

# 84. FINAL ARCHITECTURE

The final intended architecture is:

```
                     INTERNET

                        │
                        ▼

              ┌───────────────────┐
              │      Browser      │
              │                   │
              │ React + Vite      │
              └─────────┬─────────┘
                        │
                        │ HTTP
                        ▼
              ┌───────────────────┐
              │   Backend API     │
              │ Node + Express    │
              │                   │
              │ REST API          │
              │ Health checks     │
              │ Logging           │
              └───────┬─────┬─────┘
                      │     │
             ┌────────┘     └─────────┐
             │                        │
             ▼                        ▼
   ┌──────────────────┐     ┌──────────────────┐
   │ Rick & Morty API │     │   PostgreSQL     │
   │ External         │     │                  │
   │ Dependency       │     │ Favorites        │
   └──────────────────┘     └──────────────────┘
```

Docker / Harbor:

┌────────────────────────────────────────────┐
│                    HARBOR                  │
│                                            │
│  frontend:1.0.0                            │
│  backend:1.0.0                             │
│                                            │
│       ↓                                    │
│  Development                               │
│       ↓                                    │
│  QA                                        │
│       ↓                                    │
│  Staging                                   │
│       ↓                                    │
│  Production                                │
│                                            │
│  Tests → Health → Deployment → Rollback    │
└────────────────────────────────────────────┘

---

# 85. FINAL PRODUCT DESCRIPTION

Interdimensional Explorer is a small Rick and Morty themed web application that allows users to explore characters, locations, and episodes from the Rick and Morty universe and save favorite characters.

The frontend is built with React and communicates exclusively with a Node.js/Express backend.

The backend integrates with the public Rick and Morty API and PostgreSQL.

The entire application is containerized using Docker and is designed specifically to act as a realistic but lightweight workload for testing the Harbor platform's CI/CD, deployment, environment management, health checking, integration testing, monitoring, failure handling, and rollback capabilities.

Keep the implementation intentionally small, polished, testable, and deployable.
