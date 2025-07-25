import { NestFactory } from '@nestjs/core';
import { LogLevel, RequestMethod } from '@nestjs/common';

import type { INestApplication } from '@nestjs/common';

import { isDevelopmentEnv } from '@/utils/helpers/envs';

import { AppModule } from './app.module';
import { genAPIDocument } from './app.document';
import { loadMiddlewares } from './app.middleware';
import { loadErrorHandling } from './app.exception';

export const initApplication = async (): Promise<INestApplication> => {
  const isDevEnv = isDevelopmentEnv();

  const logLevels: LogLevel[] = isDevEnv
    ? ['error', 'warn', 'log', 'verbose', 'debug']
    : ['error', 'log', 'warn'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.setGlobalPrefix('v1/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  /**
   * Enables graceful shutdown for the application to let Mikro ORM perform cleanup.
   * See: https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
   */
  app.enableShutdownHooks();

  if (isDevEnv) {
    genAPIDocument(app);
  }

  loadMiddlewares(app);
  loadErrorHandling(app);

  return app;
};
