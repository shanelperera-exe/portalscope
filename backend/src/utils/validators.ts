import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(1).optional(),
});

export const characterQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['alive', 'dead', 'unknown']).optional(),
  species: z.string().trim().min(1).optional(),
  gender: z.enum(['female', 'male', 'genderless', 'unknown']).optional(),
});

export const locationQuerySchema = paginationQuerySchema.extend({
  type: z.string().trim().min(1).optional(),
  dimension: z.string().trim().min(1).optional(),
});

export const episodeQuerySchema = paginationQuerySchema.extend({
  episode: z.string().trim().min(1).optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'ID must be a positive integer' }),
});

export const characterIdParamSchema = z.object({
  characterId: z.coerce
    .number()
    .int()
    .positive({ message: 'characterId must be a positive integer' }),
});

export const createFavoriteSchema = z.object({
  characterId: z.number().int().positive({ message: 'characterId must be a positive integer' }),
});

export type CharacterQuery = z.infer<typeof characterQuerySchema>;
export type LocationQuery = z.infer<typeof locationQuerySchema>;
export type EpisodeQuery = z.infer<typeof episodeQuerySchema>;
