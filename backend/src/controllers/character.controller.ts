import type { NextFunction, Request, Response } from 'express';
import type { CharacterService } from '../services/character.service.js';
import type { AppEnv } from '../config/env.js';
import { AppError } from '../utils/errors.js';
import { characterQuerySchema, idParamSchema } from '../utils/validators.js';

export class CharacterController {
  constructor(
    private readonly service: CharacterService,
    private readonly env: AppEnv,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (this.env.ENABLE_TEST_FAILURES && this.env.NODE_ENV !== 'production') {
        throw new AppError(500, 'TEST_FAILURE', 'Simulated character listing failure');
      }
      const query = characterQuerySchema.parse(req.query);
      const result = await this.service.list(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const character = await this.service.getById(id);
      res.status(200).json(character);
    } catch (error) {
      next(error);
    }
  };
}
