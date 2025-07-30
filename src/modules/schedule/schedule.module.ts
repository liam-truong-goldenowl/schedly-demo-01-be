import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './services/schedule.service';
import { ScheduleController } from './controllers/schedule.controller';
import { UserCreatedListener } from './listeners/user-created.listener';
import { ScheduleWeeklyHour } from './entities/schedule-weekly-hour.entity';
import { ScheduleDateOverride } from './entities/schedule-date-override.entity';
import { ScheduleCreatedListener } from './listeners/schedule-created.listener';
import { ScheduleWeeklyHourService } from './services/schedule-weekly-hour.service';
import { ScheduleDateOverrideService } from './services/schedule-date-override.service';
import { ScheduleWeeklyHourController } from './controllers/schedule-weekly-hour.controller';
import { ScheduleDateOverrideController } from './controllers/schedule-date-override.controller';

@Module({
  controllers: [
    ScheduleController,
    ScheduleWeeklyHourController,
    ScheduleDateOverrideController,
  ],
  imports: [
    MikroOrmModule.forFeature([
      Schedule,
      ScheduleWeeklyHour,
      ScheduleDateOverride,
    ]),
  ],
  providers: [
    ScheduleService,
    EntityRepository,
    UserCreatedListener,
    ScheduleCreatedListener,
    ScheduleWeeklyHourService,
    ScheduleDateOverrideService,
  ],
})
export class ScheduleModule {}
