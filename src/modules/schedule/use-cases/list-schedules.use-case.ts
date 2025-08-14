import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/database/entities';

import { ScheduleMapper } from '../mappers';

@Injectable()
export class ListSchedulesUseCase {
  constructor(private em: EntityManager) {}

  async execute({ userId }: { userId: number }) {
    const schedules = await this.em.findAll(Schedule, {
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours', 'dateOverrides'],
    });

    return ScheduleMapper.toResponseList(schedules);
  }
}
