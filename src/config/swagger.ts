import { registerAs } from '@nestjs/config';

export type TSwaggerConfig = {
  title: string;
  version: string;
  description: string;
  siteTitle: string;
};

export const swaggerConfig = registerAs(
  'swagger',
  (): TSwaggerConfig => ({
    siteTitle: 'Basic NestJS Template | Documentation',
    title: 'Basic NestJS Template | Documentation',
    description: 'The Basic NestJS Template API Documentation',
    version: '1.0',
  }),
);
