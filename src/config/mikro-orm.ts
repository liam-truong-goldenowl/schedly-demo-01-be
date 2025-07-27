import { registerAs } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

import { validateEnv } from '@/utils/helpers/envs';

const env = validateEnv();

export const MikroOrm = registerAs(
  'mikro-orm',
  (): MikroOrmModuleOptions => ({
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
  }),
);
