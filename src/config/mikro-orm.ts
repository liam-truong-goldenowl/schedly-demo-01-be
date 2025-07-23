import { registerAs } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

import { Env } from '@/utils/constants/envs';
import { getEnv } from '@/utils/helpers/envs';
import { mergeDeepRight } from '@/utils/helpers/objects';

export const MikroOrm = registerAs('mikro-orm', (): MikroOrmModuleOptions => {
  const baseConfig: MikroOrmModuleOptions = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    namingStrategy: UnderscoreNamingStrategy,
    driver: PostgreSqlDriver,

    driverOptions: {
      connection: {
        ssl: process.env.DB_SSL === 'true',
      },
    },
  };

  const appEnv = getEnv();

  const envSpecificConfig: Record<string, Partial<MikroOrmModuleOptions>> = {
    [Env.STAGING]: {},
    [Env.PRODUCTION]: {},
    [Env.DEVELOPMENT]: {},
  };

  return mergeDeepRight(baseConfig, envSpecificConfig[appEnv] || {});
});
