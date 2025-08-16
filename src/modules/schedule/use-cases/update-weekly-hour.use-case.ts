import { Injectable } from '@nestjs/common';

import { WeeklyHourMapper } from '../mappers/weekly-hour.mapper';
import { UpdateWeeklyHourDto } from '../dto/req/update-weekly-hour.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class UpdateWeeklyHourUseCase {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async execute(
    scheduleId: number,
    weeklyHourId: number,
    weeklyHourData: UpdateWeeklyHourDto,
  ) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    const weeklyHour = await this.weeklyHourRepo.updateEntity(
      { schedule, id: weeklyHourId },
      weeklyHourData,
    );
    return WeeklyHourMapper.toResponse(weeklyHour);
  }
}
