import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { EventModule } from '../event/event.module';
import { UtilsModule } from '../utils/utils.module';
import { MeetingModule } from '../meeting/meeting.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { Schedule } from '../schedule/entities/schedule.entity';
import { WeeklyHour } from '../schedule/entities/weekly-hour.entity';
import { DateOverride } from '../schedule/entities/date-override.entity';

import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { CreateBookingUseCase } from './use-cases/create-booking.use-case';
import { ListTimeSlotsUseCase } from './use-cases/list-time-slots.use-case';
import { BookingCreatedListener } from './listeners/booking-created.listener';

@Module({
  controllers: [BookingController],
  imports: [
    UtilsModule,
    MeetingModule,
    EventModule,
    ScheduleModule,
    MikroOrmModule.forFeature([WeeklyHour, DateOverride, Schedule]),
  ],
  providers: [
    BookingService,
    BookingCreatedListener,
    CreateBookingUseCase,
    ListTimeSlotsUseCase,
  ],
})
export class BookingModule {}
