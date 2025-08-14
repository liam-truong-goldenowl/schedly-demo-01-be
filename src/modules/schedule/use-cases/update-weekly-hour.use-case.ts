import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { WeeklyHour } from '@/database/entities';

import { UpdateWeeklyHourDto } from '../dto';
import { WeeklyHourMapper } from '../mappers';

@Injectable()
export class UpdateWeeklyHourUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    scheduleId,
    weeklyHourId,
    weeklyHourData,
  }: {
    scheduleId: number;
    weeklyHourId: number;
    weeklyHourData: UpdateWeeklyHourDto;
  }) {
    const weeklyHour = await this.em.findOneOrFail(WeeklyHour, {
      id: weeklyHourId,
      schedule: { id: scheduleId },
    });

    weeklyHour.assign(weeklyHourData);

    await this.em.flush();

    return WeeklyHourMapper.toResponse(weeklyHour);
  }
}
