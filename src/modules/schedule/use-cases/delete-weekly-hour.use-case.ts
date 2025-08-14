import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { WeeklyHour } from '@/database/entities';

@Injectable()
export class DeleteWeeklyHourUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    scheduleId,
    weeklyHourId,
  }: {
    scheduleId: number;
    weeklyHourId: number;
  }) {
    const weeklyHour = await this.em.findOneOrFail(WeeklyHour, {
      id: weeklyHourId,
      schedule: { id: scheduleId },
    });

    await this.em.removeAndFlush(weeklyHour);
  }
}
