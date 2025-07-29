import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedule.controller';
import { ScheduleWeeklyHour } from './entities/schedule-weekly-hour.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Schedule, ScheduleWeeklyHour])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
