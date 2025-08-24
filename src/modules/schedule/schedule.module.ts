import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { UtilsModule } from '../utils/utils.module';

import { Schedule } from './entities/schedule.entity';
import { WeeklyHour } from './entities/weekly-hour.entity';
import { DateOverride } from './entities/date-override.entity';
import { ScheduleController } from './controllers/schedule.controller';
import { DateOverrideService } from './services/date-override.service';
import { ListSchedulesUseCase } from './use-cases/list-schedules.use-case';
import { WeeklyHourController } from './controllers/weekly-hour.controller';
import { CreateScheduleUseCase } from './use-cases/create-schedule.use-case';
import { DeleteScheduleUseCase } from './use-cases/delete-schedule.use-case';
import { UpdateScheduleUseCase } from './use-cases/update-schedule.use-case';
import { DateOverrideController } from './controllers/date-override.controller';
import { CreateWeeklyHourUseCase } from './use-cases/create-weekly-hour.use-case';
import { DeleteWeeklyHourUseCase } from './use-cases/delete-weekly-hour.use-case';
import { UpdateWeeklyHourUseCase } from './use-cases/update-weekly-hour.use-case';
import { CreateDateOverrideUseCase } from './use-cases/create-date-override.use-case';
import { DeleteDateOverrideUseCase } from './use-cases/delete-date-override.use-case';
import { UpdateDateOverrideUseCase } from './use-cases/update-date-override.use-case';

@Module({
  controllers: [
    ScheduleController,
    WeeklyHourController,
    DateOverrideController,
  ],
  imports: [
    MikroOrmModule.forFeature([Schedule, DateOverride, WeeklyHour, User]),
    UtilsModule,
    AuthModule,
  ],
  providers: [
    DateOverrideService,
    ListSchedulesUseCase,
    CreateScheduleUseCase,
    UpdateScheduleUseCase,
    DeleteScheduleUseCase,
    CreateWeeklyHourUseCase,
    DeleteWeeklyHourUseCase,
    UpdateWeeklyHourUseCase,
    CreateDateOverrideUseCase,
    UpdateDateOverrideUseCase,
    DeleteDateOverrideUseCase,
  ],
})
export class ScheduleModule {}
