import 'dotenv/config';

import {
  defineConfig,
  PostgreSqlDriver,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const conf = new ConfigService();
const logger = new Logger('MikroORM');
const sqlHighlighter = new SqlHighlighter();

export default defineConfig({
  debug: true,
  logger: logger.log.bind(logger),

  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      ssl: conf.getOrThrow<string>('DB_SSL') == 'true',
    },
  },
  port: conf.getOrThrow<number>('DB_PORT'),
  host: conf.getOrThrow<string>('DB_HOST'),
  dbName: conf.getOrThrow<string>('DB_NAME'),
  user: conf.getOrThrow<string>('DB_USER'),
  password: conf.getOrThrow<string>('DB_PASSWORD'),

  highlighter: sqlHighlighter,
  namingStrategy: UnderscoreNamingStrategy,

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'migrations',
    pathTs: 'migrations',
  },
  seeder: {
    path: 'seeders',
    pathTs: 'seeders',
  },

  extensions: [Migrator, SeedManager],
});
