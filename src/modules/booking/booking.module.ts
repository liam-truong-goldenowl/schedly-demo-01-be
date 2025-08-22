import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UtilsModule } from '../utils/utils.module';
import { Event } from '../event/entities/event.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { WeeklyHour } from '../schedule/entities/weekly-hour.entity';
import { MeetingHost } from '../meeting/entities/meeting-host.entity';
import { DateOverride } from '../schedule/entities/date-override.entity';
import { MeetingInvitee } from '../meeting/entities/meeting-invitee.entity';

import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ReminderProcessor } from './queue/reminder.processor';
import { CreateBookingUseCase } from './use-cases/create-booking.use-case';
import { ListTimeSlotsUseCase } from './use-cases/list-time-slots.use-case';
import { BookingCreatedListener } from './listeners/booking-created.listener';

@Module({
  controllers: [BookingController],
  imports: [
    UtilsModule,
    MikroOrmModule.forFeature([
      WeeklyHour,
      DateOverride,
      Schedule,
      Event,
      Meeting,
      MeetingHost,
      MeetingInvitee,
    ]),
    BullModule.registerQueue({ name: 'reminder' }),
  ],
  providers: [
    BookingService,
    BookingCreatedListener,
    CreateBookingUseCase,
    ListTimeSlotsUseCase,
    ReminderProcessor,
  ],
})
export class BookingModule {}
