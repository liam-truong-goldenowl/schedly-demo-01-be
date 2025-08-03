import { registerAs } from '@nestjs/config';

export interface ISwaggerConfig {
  title: string;
  version: string;
  siteTitle: string;
  description: string;
}

export const swaggerConfig = registerAs('swagger', (): ISwaggerConfig => {
  return {
    version: '1.0',
    title: 'Schedly API | Documentation',
    siteTitle: 'Schedly API | Documentation',
    description: 'The Schedly API Documentation',
  };
});
