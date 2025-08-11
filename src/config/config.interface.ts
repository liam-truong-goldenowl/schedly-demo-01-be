import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export interface Config {
  app: AppConfig;
  jwt: JwtConfig;
  swagger: SwaggerConfig;
  mikroOrm: MikroOrmConfig;
}

export interface AppConfig {
  port: number;
  env: 'development' | 'production' | 'staging';
  isDev: boolean;
  isProd: boolean;
  isStaging: boolean;
  corsOrigins: string[];
}

export interface SwaggerConfig {
  title: string;
  path: string;
  version: string;
  siteTitle: string;
  description: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export type MikroOrmConfig = MikroOrmModuleOptions;
