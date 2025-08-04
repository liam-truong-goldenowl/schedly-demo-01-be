import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

import type { INestApplication } from '@nestjs/common';

import { IAppConfig } from '@/config/app';

export const loadMiddlewares = (app: INestApplication): void => {
  const confService = app.get(ConfigService);

  const { corsOrigin } = confService.get<IAppConfig>('app')!;

  /**
   * Parses the `corsOrigin` string into an array of origin URLs.
   * Splits the string by commas, trims whitespace from each origin,
   * and removes any trailing slashes.
   *
   * @example
   * // Given corsOrigin = "https://example.com/, http://localhost:3000/"
   * // origins will be ["https://example.com", "http://localhost:3000"]
   */
  const origins = corsOrigin
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''));

  app.enableCors({ origin: origins, credentials: true });

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
};
