import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/database/entities';

import { UpdateScheduleDto } from '../dto';
import { ScheduleMapper } from '../mappers';

@Injectable()
export class UpdateScheduleUseCase {
  constructor(private em: EntityManager) {}

  async execute(input: {
    userId: number;
    scheduleId: number;
    scheduleData: UpdateScheduleDto;
  }) {
    const schedule = await this.em.findOneOrFail(
      Schedule,
      {
        id: input.scheduleId,
        user: { id: input.userId },
      },
      {
        populate: ['weeklyHours', 'dateOverrides'],
      },
    );

    schedule.assign(input.scheduleData);
    await this.em.flush();

    return ScheduleMapper.toResponse(schedule);
  }
}
