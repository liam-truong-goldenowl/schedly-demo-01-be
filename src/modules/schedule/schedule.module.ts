import { Module } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';

import * as UseCases from './use-cases';
import { ScheduleService } from './services/schedule.service';
import { WeeklyHourService } from './services/weekly-hour.service';
import { ScheduleController } from './controllers/schedule.controller';
import { DateOverrideService } from './services/date-override.service';
import { UserCreatedListener } from './listeners/user-created.listener';
import { WeeklyHourController } from './controllers/weekly-hour.controller';
import { ScheduleCreatedListener } from './listeners/schedule-created.listener';
import { DateOverrideController } from './controllers/date-override.controller';

@Module({
  controllers: [
    ScheduleController,
    WeeklyHourController,
    DateOverrideController,
  ],
  imports: [],
  providers: [
    ScheduleService,
    EntityRepository,
    UserCreatedListener,
    ScheduleCreatedListener,
    WeeklyHourService,
    DateOverrideService,
    ...Object.values(UseCases),
  ],
})
export class ScheduleModule {}
