import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { UUIDModule } from '@/modules/uuid/uuid.module';
import { EventModule } from '@/modules/event/event.module';
import { SharingModule } from '@/modules/sharing/sharing.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { UserSettingsModule } from '@/modules/user-setting/user-setting.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UUIDModule,
    EventModule,
    SharingModule,
    ScheduleModule,
    UserSettingsModule,
  ],
})
export class ModuleRegistry {}
