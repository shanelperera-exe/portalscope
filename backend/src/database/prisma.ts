import { Prisma, PrismaClient } from '@prisma/client';
import { DependencyUnavailableError } from '../utils/errors.js';
import { log } from '../utils/logger.js';

export class PrismaClientHolder {
  private client: PrismaClient | null = null;

  get(): PrismaClient {
    if (!this.client) {
      this.client = new PrismaClient();
    }
    return this.client;
  }

  async connect(): Promise<void> {
    try {
      await this.get().$connect();
    } catch (error) {
      log('ERROR', 'Database connection failed', {
        name: error instanceof Error ? error.name : 'UnknownError',
      });
      throw new DependencyUnavailableError('Database unavailable');
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.get().$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      log('ERROR', 'Database connection failed', {
        name: error instanceof Error ? error.name : 'UnknownError',
      });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
    }
  }
}

export const prismaHolder = new PrismaClientHolder();

export { Prisma };
