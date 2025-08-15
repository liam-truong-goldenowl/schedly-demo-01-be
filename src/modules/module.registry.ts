import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UUIDModule } from './uuid/uuid.module';
import { EventModule } from './event/event.module';
import { UtilsModule } from './utils/utils.module';
import { BookingModule } from './booking/booking.module';
import { SharingModule } from './sharing/sharing.module';
import { MeetingModule } from './meeting/meeting.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UUIDModule,
    EventModule,
    SharingModule,
    ScheduleModule,
    BookingModule,
    UtilsModule,
    MeetingModule,
  ],
})
export class ModuleRegistry {}
