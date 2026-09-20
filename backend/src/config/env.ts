import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

loadDotenv({ path: resolve(process.cwd(), '.env') });
loadDotenv({ path: resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'qa', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  RICK_AND_MORTY_API_URL: z.string().url().default('https://rickandmortyapi.com/api'),
  RICK_AND_MORTY_API_TIMEOUT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ENABLE_TEST_FAILURES: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  APP_VERSION: z.string().default('1.0.0'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Invalid environment configuration: ${message}`);
  }
  return parsed.data;
}
