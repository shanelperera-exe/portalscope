import type { NextFunction, Request, Response } from 'express';
import { log } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const started = Date.now();
  log('INFO', 'Request received', { method: req.method, route: req.originalUrl });

  res.on('finish', () => {
    log('INFO', 'Request completed', {
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - started,
    });
  });

  next();
}
