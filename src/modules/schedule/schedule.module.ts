import { Module } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ScheduleService } from './services/schedule.service';
import { ScheduleController } from './controllers/schedule.controller';
import { DateOverrideService } from './services/date-override.service';
import { UserCreatedListener } from './listeners/user-created.listener';
import { WeeklyHourService } from './services/schedule-weekly-hour.service';
import { ScheduleCreatedListener } from './listeners/schedule-created.listener';
import { ScheduleWeeklyHourController } from './controllers/schedule-weekly-hour.controller';
import { ScheduleDateOverrideController } from './controllers/schedule-date-override.controller';

@Module({
  controllers: [
    ScheduleController,
    ScheduleWeeklyHourController,
    ScheduleDateOverrideController,
  ],
  imports: [],
  providers: [
    ScheduleService,
    EntityRepository,
    UserCreatedListener,
    ScheduleCreatedListener,
    WeeklyHourService,
    DateOverrideService,
  ],
})
export class ScheduleModule {}
