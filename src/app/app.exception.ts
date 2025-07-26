import { ValidationPipe } from '@nestjs/common';

import type { INestApplication } from '@nestjs/common';

export const loadErrorHandling = (app: INestApplication): void => {
  app.useGlobalPipes(new ValidationPipe());
};
