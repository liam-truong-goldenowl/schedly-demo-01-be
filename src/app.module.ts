import { BullModule } from '@nestjs/bull';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SentryModule } from '@sentry/nestjs/setup';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ModuleRegistry } from './modules/module.registry';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule,
    ModuleRegistry,
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => config.getOrThrow('mikroOrm'),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getOrThrow('bull'),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
