import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Schedule } from '../entities/schedule.entity';
import { WeeklyHour } from '../entities/weekly-hour.entity';
import { WeeklyHourMapper } from '../mappers/weekly-hour.mapper';
import { CreateWeeklyHourDto } from '../dto/req/create-weekly-hour.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class CreateWeeklyHourUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async execute(scheduleId: number, weeklyHourData: CreateWeeklyHourDto) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    await this.weeklyHourRepo.ensureNoOverlap({ schedule, ...weeklyHourData });
    const weeklyHour = await this.weeklyHourRepo.createEntity({
      schedule,
      ...weeklyHourData,
    });
    return WeeklyHourMapper.toResponse(weeklyHour);
  }
}
