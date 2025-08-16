import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ModuleRegistry } from './modules/module.registry';
import { BaseRepository } from './common/repositories/base.repository';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule,
    ModuleRegistry,
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        ...config.getOrThrow('mikroOrm'),
        entityRepository: BaseRepository,
      }),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
