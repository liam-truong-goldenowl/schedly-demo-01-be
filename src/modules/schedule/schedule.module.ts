import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedule.controller';
import { UserCreatedListener } from './listeners/user-created.listener';
import { ScheduleWeeklyHour } from './entities/schedule-weekly-hour.entity';
import { ScheduleDateOverride } from './entities/schedule-date-override.entity';
import { ScheduleCreatedListener } from './listeners/schedule-created.listener';

@Module({
  controllers: [ScheduleController],
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
  ],
})
export class ScheduleModule {}
