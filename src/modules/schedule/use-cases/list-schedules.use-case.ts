import { Injectable } from '@nestjs/common';

import { ScheduleMapper } from '../mappers/schedule.mapper';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class ListSchedulesUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepository) {}

  async execute({ userId }: { userId: number }) {
    const schedules = await this.scheduleRepo.findAll({
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours', 'dateOverrides'],
    });
    return ScheduleMapper.toResponseList(schedules);
  }
}
