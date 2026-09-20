import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/errors.js';
import { log } from '../utils/logger.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: error.issues[0]?.message ?? 'Invalid request',
      code: 'INVALID_REQUEST',
    });
    return;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      log('ERROR', error.message, { code: error.code, status: error.statusCode });
    }
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  log('ERROR', 'Unhandled application error', {
    name: error instanceof Error ? error.name : 'UnknownError',
  });
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
