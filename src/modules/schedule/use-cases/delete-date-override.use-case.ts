import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { DateOverride } from '@/database/entities';

@Injectable()
export class DeleteDateOverrideUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    scheduleId,
    dateOverrideId,
  }: {
    scheduleId: number;
    dateOverrideId: number;
  }) {
    const dateOverride = await this.em.findOneOrFail(DateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    await this.em.removeAndFlush(dateOverride);
  }
}
