import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { prismaHolder } from './database/prisma.js';
import { log } from './utils/logger.js';

async function main(): Promise<void> {
  const env = loadEnv();
  const app = createApp(env);

  try {
    await prismaHolder.connect();
  } catch {
    log('ERROR', 'Database connection failed', { route: 'startup' });
  }

  const server = app.listen(env.PORT, () => {
    log('INFO', 'Backend listening', { port: env.PORT, version: env.APP_VERSION });
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await prismaHolder.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => {
    void shutdown();
  });
  process.on('SIGINT', () => {
    void shutdown();
  });
}

main().catch((error: unknown) => {
  log('ERROR', 'Backend failed to start', {
    name: error instanceof Error ? error.name : 'UnknownError',
  });
  process.exit(1);
});
