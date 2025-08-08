import { ConfigFactory } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import {
  PostgreSqlDriver,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';

import { getEnv } from '@/shared/utils/envs';

export interface AppConfig {
  env: string;
  port: number;
  corsOrigin: string;
}

export interface SwaggerConfig {
  title: string;
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

export interface Config {
  app: AppConfig;
  swagger: SwaggerConfig;
  jwt: JwtConfig;
  ['mikro-orm']: MikroOrmModuleOptions;
}

export const loadConfig: ConfigFactory<Config> = () => {
  const env = getEnv();

  return {
    app: {
      port: env.PORT,
      env: env.NODE_ENV,
      corsOrigin: env.CORS_ORIGIN,
    },

    swagger: {
      version: '1.0',
      title: 'Schedly API | Documentation',
      siteTitle: 'Schedly API | Documentation',
      description: 'The Schedly API Documentation',
    },

    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshSecret: env.JWT_REFRESH_SECRET,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },

    ['mikro-orm']: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dbName: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,

      driver: PostgreSqlDriver,
      debug: env.isDevelopment,
      driverOptions: { connection: { ssl: env.DB_SSL } },

      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],

      namingStrategy: UnderscoreNamingStrategy,
    },
  };
};
