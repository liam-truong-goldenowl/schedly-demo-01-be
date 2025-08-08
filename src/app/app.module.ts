import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { loadConfig } from '@/config/conf-factory';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { UUIDModule } from '@/modules/uuid/uuid.module';
import { EventModule } from '@/modules/event/event.module';
import { DatabaseModule } from '@/database/database.module';
import { SharingModule } from '@/modules/sharing/sharing.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { UserSettingsModule } from '@/modules/user-setting/user-setting.module';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    UserModule,
    UUIDModule,
    EventModule,
    SharingModule,
    DatabaseModule,
    ScheduleModule,
    UserSettingsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
  ],
})
export class AppModule {}
