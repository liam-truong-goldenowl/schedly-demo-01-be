import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Schedule } from '../entities/schedule.entity';
import { WeeklyHour } from '../entities/weekly-hour.entity';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class DeleteWeeklyHourUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async execute(scheduleId: number, weeklyHourId: number) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    await this.weeklyHourRepo.deleteEntity({ id: weeklyHourId, schedule });
  }
}
