import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';

import type { INestApplication } from '@nestjs/common';

import { ConfigService } from '@/config/config.service';

import { AppModule } from './app.module';
import { loadFilters } from './app.filter';
import { genAPIDocument } from './app.document';
import { loadMiddlewares } from './app.middleware';
import { loadErrorHandling } from './app.exception';

export const initApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const { isDev } = configService.getOrThrow('app');

  app.setGlobalPrefix('v1/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  /**
   * Enables graceful shutdown for the application to let Mikro ORM perform cleanup.
   * See: https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
   */
  app.enableShutdownHooks();

  if (isDev) {
    genAPIDocument(app);
  }

  loadFilters(app);
  loadMiddlewares(app);
  loadErrorHandling(app);

  return app;
};
