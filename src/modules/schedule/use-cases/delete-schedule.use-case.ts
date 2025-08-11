import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/database/entities';

import { ScheduleService } from '../services/schedule.service';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    private em: EntityManager,
    private scheduleService: ScheduleService,
  ) {}

  async execute({
    userId,
    scheduleId,
  }: {
    userId: number;
    scheduleId: number;
  }): Promise<void> {
    const schedule = await this.em.findOneOrFail(Schedule, {
      id: scheduleId,
      user: { id: userId },
    });

    if (schedule.isDefault) {
      await this.scheduleService.changeDefaultSchedule(userId);
    }

    await this.em.removeAndFlush(schedule);
  }
}
