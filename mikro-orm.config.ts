import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import {
  defineConfig,
  PostgreSqlDriver,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';

dotenvConfig();

const configService = new ConfigService();
const logger = new Logger('MikroORM');

export default defineConfig({
  debug: true,
  logger: logger.log.bind(logger),
  highlighter: new SqlHighlighter(),

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  namingStrategy: UnderscoreNamingStrategy,

  driver: PostgreSqlDriver,
  port: configService.getOrThrow<number>('DB_PORT'),
  host: configService.getOrThrow<string>('DB_HOST'),
  dbName: configService.getOrThrow<string>('DB_NAME'),
  user: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),

  driverOptions: {
    connection: {
      ssl: configService.getOrThrow<string>('DB_SSL') == 'true',
    },
  },
  migrations: {
    path: 'src/database/migrations',
    pathTs: 'src/database/migrations',
  },
  seeder: {
    path: 'src/database/seeders',
    pathTs: 'src/database/seeders',
  },

  extensions: [Migrator, SeedManager],
});
