import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleMapper } from '../mappers/schedule.mapper';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class ListSchedulesUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
  ) {}

  async execute({ userId }: { userId: number }) {
    const schedules = await this.scheduleRepo.findAll({
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours', 'dateOverrides'],
    });
    return ScheduleMapper.toResponseList(schedules);
  }
}
