import type { NextFunction, Request, Response } from 'express';
import type { EpisodeService } from '../services/episode.service.js';
import { episodeQuerySchema, idParamSchema } from '../utils/validators.js';

export class EpisodeController {
  constructor(private readonly service: EpisodeService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = episodeQuerySchema.parse(req.query);
      const result = await this.service.list(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const episode = await this.service.getById(id);
      res.status(200).json(episode);
    } catch (error) {
      next(error);
    }
  };
}
