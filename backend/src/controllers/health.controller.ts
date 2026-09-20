import type { Request, Response } from 'express';
import type { AppEnv } from '../config/env.js';
import type { RickAndMortyClient } from '../clients/rickAndMorty.client.js';
import { prismaHolder } from '../database/prisma.js';

export class HealthController {
  constructor(
    private readonly env: AppEnv,
    private readonly client: RickAndMortyClient,
  ) {}

  health(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      service: 'interdimensional-explorer-backend',
      version: this.env.APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  }

  async ready(_req: Request, res: Response): Promise<void> {
    const [databaseOk, externalApiOk] = await Promise.all([
      prismaHolder.ping(),
      this.client.ping(),
    ]);

    const ready = databaseOk;
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      database: databaseOk ? 'ok' : 'unavailable',
      externalApi: externalApiOk ? 'ok' : 'unavailable',
    });
  }
}
