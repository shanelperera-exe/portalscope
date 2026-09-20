import { Router } from 'express';
import type { CharacterController } from '../controllers/character.controller.js';

export function createCharacterRouter(controller: CharacterController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  return router;
}
