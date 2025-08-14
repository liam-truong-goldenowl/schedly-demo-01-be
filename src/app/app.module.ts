import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { LoggerMiddleware } from '@/middleware';
import { ConfigModule } from '@/config/config.module';
import { ModuleRegistry } from '@/modules/module.registry';
import { DatabaseModule } from '@/database/database.module';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,
    DatabaseModule,
    ModuleRegistry,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
