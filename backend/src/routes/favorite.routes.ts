import { Router } from 'express';
import type { FavoriteController } from '../controllers/favorite.controller.js';

export function createFavoriteRouter(controller: FavoriteController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.post('/', controller.create);
  router.delete('/:characterId', controller.remove);
  return router;
}
