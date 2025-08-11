import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import type { INestApplication } from '@nestjs/common';

import { ConfigService } from '@/config';

export const loadMiddlewares = (app: INestApplication): void => {
  const configService = app.get(ConfigService);

  const { corsOrigins: corsOrigin } = configService.getOrThrow('app');

  app.enableCors({ origin: corsOrigin, credentials: true });

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
};
