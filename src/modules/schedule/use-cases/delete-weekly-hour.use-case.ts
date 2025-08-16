import { Injectable } from '@nestjs/common';

import { ScheduleRepository } from '../repositories/schedule.repository';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class DeleteWeeklyHourUseCase {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async execute(scheduleId: number, weeklyHourId: number) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    await this.weeklyHourRepo.deleteEntity({ id: weeklyHourId, schedule });
  }
}
