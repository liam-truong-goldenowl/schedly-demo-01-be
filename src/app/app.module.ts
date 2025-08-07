import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigFactory } from '@nestjs/config';

import { appConfig } from '@/config/app';
import { jwtConfig } from '@/config/jwt';
import { swaggerConfig } from '@/config/swagger';
import { mikroOrmConfig } from '@/config/mikro-orm';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { UUIDModule } from '@/modules/uuid/uuid.module';
import { EventModule } from '@/modules/event/event.module';
import { DatabaseModule } from '@/database/database.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { UserSettingsModule } from '@/modules/user-setting/user-setting.module';

import { AppController } from './app.controller';

const confLoaders: ConfigFactory[] = [
  appConfig,
  jwtConfig,
  swaggerConfig,
  mikroOrmConfig,
];

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    UserModule,
    UUIDModule,
    EventModule,
    DatabaseModule,
    ScheduleModule,
    UserSettingsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: confLoaders }),
  ],
})
export class AppModule {}
