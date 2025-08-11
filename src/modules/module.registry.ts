import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UUIDModule } from './uuid/uuid.module';
import { EventModule } from './event/event.module';
import { SharingModule } from './sharing/sharing.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UUIDModule,
    EventModule,
    SharingModule,
    ScheduleModule,
  ],
})
export class ModuleRegistry {}
