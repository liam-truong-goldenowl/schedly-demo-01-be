import { registerAs } from '@nestjs/config';

export interface SwaggerConfig {
  title: string;
  version: string;
  siteTitle: string;
  description: string;
}

export const swaggerConfig = registerAs(
  'swagger',
  (): SwaggerConfig => ({
    siteTitle: 'Schedly API | Documentation',
    title: 'Schedly API | Documentation',
    description: 'The Schedly API Documentation',
    version: '1.0',
  }),
);
