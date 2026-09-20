import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import type { AppEnv } from './config/env.js';
import { RickAndMortyClient } from './clients/rickAndMorty.client.js';
import { CharacterController } from './controllers/character.controller.js';
import { EpisodeController } from './controllers/episode.controller.js';
import { FavoriteController } from './controllers/favorite.controller.js';
import { HealthController } from './controllers/health.controller.js';
import { LocationController } from './controllers/location.controller.js';
import { openApiDocument } from './docs/openapi.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { FavoriteRepository } from './repositories/favorite.repository.js';
import { createCharacterRouter } from './routes/character.routes.js';
import { createEpisodeRouter } from './routes/episode.routes.js';
import { createFavoriteRouter } from './routes/favorite.routes.js';
import { createHealthRouter } from './routes/health.routes.js';
import { createLocationRouter } from './routes/location.routes.js';
import { CharacterService } from './services/character.service.js';
import { EpisodeService } from './services/episode.service.js';
import { FavoriteService } from './services/favorite.service.js';
import { LocationService } from './services/location.service.js';

export interface AppOptions {
  fetchImpl?: typeof fetch;
  favoriteRepository?: FavoriteRepository;
}

export function createApp(env: AppEnv, options: AppOptions = {}): express.Express {
  const fetchImpl = options.fetchImpl ?? fetch;
  const client = new RickAndMortyClient(env, fetchImpl);
  const characterService = new CharacterService(client);
  const locationService = new LocationService(client);
  const episodeService = new EpisodeService(client);
  const favoriteService = new FavoriteService(
    options.favoriteRepository ?? new FavoriteRepository(),
    characterService,
  );

  const app = express();
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    }),
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(requestLogger);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/api', createHealthRouter(new HealthController(env, client)));
  app.use('/api/characters', createCharacterRouter(new CharacterController(characterService, env)));
  app.use('/api/locations', createLocationRouter(new LocationController(locationService)));
  app.use('/api/episodes', createEpisodeRouter(new EpisodeController(episodeService)));
  app.use('/api/favorites', createFavoriteRouter(new FavoriteController(favoriteService)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
