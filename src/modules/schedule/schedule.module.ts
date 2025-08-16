import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';

import { Schedule } from './entities/schedule.entity';
import { WeeklyHour } from './entities/weekly-hour.entity';
import { ScheduleService } from './services/schedule.service';
import { DateOverride } from './entities/date-override.entity';
import { ScheduleController } from './controllers/schedule.controller';
import { DateOverrideService } from './services/date-override.service';
import { UserCreatedListener } from './listeners/user-created.listener';
import { ScheduleRepository } from './repositories/schedule.repository';
import { WeeklyHourController } from './controllers/weekly-hour.controller';
import { WeeklyHourRepository } from './repositories/weekly-hour.repository';
import { DateOverrideController } from './controllers/date-override.controller';
import { ScheduleCreatedListener } from './listeners/schedule-created.listener';
import { DateOverrideRepository } from './repositories/date-override.repository';

@Module({
  controllers: [
    ScheduleController,
    WeeklyHourController,
    DateOverrideController,
  ],
  imports: [
    MikroOrmModule.forFeature([Schedule, DateOverride, WeeklyHour]),
    UserModule,
    UtilsModule,
  ],
  exports: [ScheduleRepository, DateOverrideRepository, WeeklyHourRepository],
  providers: [
    ScheduleService,
    UserCreatedListener,
    ScheduleCreatedListener,
    DateOverrideService,
    ScheduleRepository,
    DateOverrideRepository,
    WeeklyHourRepository,
  ],
})
export class ScheduleModule {}
