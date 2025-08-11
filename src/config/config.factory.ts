import { ConfigFactory } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

import { validateEnv } from './env.validator';

import type { Config } from './config.interface';

export const loadConfig: ConfigFactory<Config> = () => {
  const env = validateEnv();

  return {
    app: {
      port: env.PORT,
      env: env.NODE_ENV,
      isDev: env.NODE_ENV === 'development',
      isProd: env.NODE_ENV === 'production',
      isStaging: env.NODE_ENV === 'staging',
      corsOrigins: env.CORS_ORIGINS,
    },

    swagger: {
      version: '1.0',
      path: 'api/documentation',
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

    mikroOrm: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      dbName: env.DB_NAME,
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
