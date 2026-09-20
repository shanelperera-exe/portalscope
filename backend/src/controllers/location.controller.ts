import type { NextFunction, Request, Response } from 'express';
import type { LocationService } from '../services/location.service.js';
import { idParamSchema, locationQuerySchema } from '../utils/validators.js';

export class LocationController {
  constructor(private readonly service: LocationService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = locationQuerySchema.parse(req.query);
      const result = await this.service.list(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = idParamSchema.parse(req.params);
      const location = await this.service.getById(id);
      res.status(200).json(location);
    } catch (error) {
      next(error);
    }
  };
}
