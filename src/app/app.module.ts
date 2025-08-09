import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ConfigModule } from '@/config/config.module';
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
    ConfigModule,
    SharingModule,
    DatabaseModule,
    ScheduleModule,
    UserSettingsModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
