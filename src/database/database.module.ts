import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { ConfigService } from '@/config/config.service';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => config.getOrThrow('mikroOrm'),
    }),
  ],
})
export class DatabaseModule {}
