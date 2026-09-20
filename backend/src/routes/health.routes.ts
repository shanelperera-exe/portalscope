import { Router } from 'express';
import type { HealthController } from '../controllers/health.controller.js';

export function createHealthRouter(controller: HealthController): Router {
  const router = Router();
  router.get('/health', (req, res) => controller.health(req, res));
  router.get('/ready', (req, res, next) => {
    controller.ready(req, res).catch(next);
  });
  return router;
}
