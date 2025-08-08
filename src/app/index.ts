import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';

import type { LogLevel, INestApplication } from '@nestjs/common';

import { getEnv } from '@/shared/utils/envs';

import { AppModule } from './app.module';
import { loadFilters } from './app.filter';
import { genAPIDocument } from './app.document';
import { loadMiddlewares } from './app.middleware';
import { loadErrorHandling } from './app.exception';

export const initApplication = async (): Promise<INestApplication> => {
  const env = getEnv();

  const logLevels: LogLevel[] = env.isDev
    ? ['error', 'warn', 'log', 'verbose', 'debug']
    : ['error', 'log', 'warn'];

  const app = await NestFactory.create(AppModule, { logger: logLevels });

  app.setGlobalPrefix('v1/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  /**
   * Enables graceful shutdown for the application to let Mikro ORM perform cleanup.
   * See: https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
   */
  app.enableShutdownHooks();

  if (env.isDev) {
    genAPIDocument(app);
  }

  loadFilters(app);
  loadMiddlewares(app);
  loadErrorHandling(app);

  return app;
};
