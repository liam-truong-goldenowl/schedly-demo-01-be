import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { ConfigService } from '@/config';

import * as Entities from './entities';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => config.getOrThrow('mikroOrm'),
    }),
    MikroOrmModule.forFeature(Object.values(Entities)),
  ],
})
export class DatabaseModule {}
