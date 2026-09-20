import { Router } from 'express';
import type { LocationController } from '../controllers/location.controller.js';

export function createLocationRouter(controller: LocationController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  return router;
}
