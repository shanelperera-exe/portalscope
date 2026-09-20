import type { Favorite } from '@prisma/client';
import { Prisma, prismaHolder } from '../database/prisma.js';
import { ConflictError, DependencyUnavailableError } from '../utils/errors.js';

const DEMO_USER_ID = 1;

export class FavoriteRepository {
  async list(): Promise<Favorite[]> {
    try {
      return await prismaHolder.get().favorite.findMany({
        where: { userId: DEMO_USER_ID },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.rethrow(error);
    }
  }

  async findByCharacterId(characterId: number): Promise<Favorite | null> {
    try {
      return await prismaHolder.get().favorite.findUnique({
        where: {
          userId_characterId: {
            userId: DEMO_USER_ID,
            characterId,
          },
        },
      });
    } catch (error) {
      this.rethrow(error);
    }
  }

  async create(characterId: number): Promise<Favorite> {
    try {
      return await prismaHolder.get().favorite.create({
        data: {
          userId: DEMO_USER_ID,
          characterId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Character is already in favorites');
      }
      this.rethrow(error);
    }
  }

  async deleteByCharacterId(characterId: number): Promise<boolean> {
    const existing = await this.findByCharacterId(characterId);
    if (!existing) {
      return false;
    }
    try {
      await prismaHolder.get().favorite.delete({ where: { id: existing.id } });
      return true;
    } catch (error) {
      this.rethrow(error);
    }
  }

  private rethrow(error: unknown): never {
    if (error instanceof ConflictError) {
      throw error;
    }
    throw new DependencyUnavailableError('Database unavailable');
  }
}
