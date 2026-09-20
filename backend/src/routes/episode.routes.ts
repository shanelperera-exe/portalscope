import { Router } from 'express';
import type { EpisodeController } from '../controllers/episode.controller.js';

export function createEpisodeRouter(controller: EpisodeController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  return router;
}
