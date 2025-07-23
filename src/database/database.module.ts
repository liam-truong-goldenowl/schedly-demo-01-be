import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) =>
        configService.get<MikroOrmModuleOptions>('mikro-orm')!,
    }),
  ],
})
export class DatabaseModule {}
