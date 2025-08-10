import type { INestApplication } from '@nestjs/common';

import { GlobalExceptionFilter } from '@/filters/global-exception.filter';

export const loadFilters = (app: INestApplication): void => {
  app.useGlobalFilters(new GlobalExceptionFilter());
};
