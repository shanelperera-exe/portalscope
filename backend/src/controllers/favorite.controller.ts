import type { NextFunction, Request, Response } from 'express';
import type { FavoriteService } from '../services/favorite.service.js';
import { characterIdParamSchema, createFavoriteSchema } from '../utils/validators.js';

export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const favorites = await this.service.list();
      res.status(200).json({ data: favorites });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createFavoriteSchema.parse(req.body);
      const favorite = await this.service.add(body.characterId);
      res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { characterId } = characterIdParamSchema.parse(req.params);
      await this.service.remove(characterId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
