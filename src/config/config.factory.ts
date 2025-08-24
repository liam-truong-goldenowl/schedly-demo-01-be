import { ConfigFactory } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

import { DAY } from '@/common/utils/constants/time';

import { Config } from './config.interface';
import { getEnvOrThrow } from './config.env';

export const loadConfig: ConfigFactory<Config> = () => {
  const env = getEnvOrThrow();

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
      ignoreUndefinedInQuery: true,

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

    mail: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.NODE_ENV !== 'development',
      auth:
        env.NODE_ENV === 'development'
          ? undefined
          : {
              user: env.MAIL_USER,
              pass: env.MAIL_PASS,
            },
      sender: env.MAIL_SENDER,
    },

    cookies: {
      accessTokenKey: '__schedly__accessToken',
      refreshTokenKey: '__schedly__refreshToken',
      accessTokenExpiresIn: 7 * DAY,
      refreshTokenExpiresIn: 30 * DAY,
    },

    bull: {
      url: env.REDIS_URL,
    },
  };
};
