import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import type { INestApplication } from '@nestjs/common';

export const loadMiddlewares = (app: INestApplication): void => {
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
};
