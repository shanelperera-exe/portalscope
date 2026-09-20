import { z } from 'zod';

const namedRefSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export const rickAndMortyCharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  image: z.string(),
  origin: namedRefSchema,
  location: namedRefSchema,
  episode: z.array(z.string()),
});

export const rickAndMortyLocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  dimension: z.string(),
  residents: z.array(z.string()),
});

export const rickAndMortyEpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
  characters: z.array(z.string()),
});

export const rickAndMortyListSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    info: z.object({
      count: z.number(),
      pages: z.number(),
      next: z.string().nullable(),
      prev: z.string().nullable(),
    }),
    results: z.array(item),
  });
