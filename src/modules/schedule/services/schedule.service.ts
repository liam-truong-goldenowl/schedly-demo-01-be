import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/database/entities';

import { AtLeastOneScheduleException } from '../exceptions';

@Injectable()
export class ScheduleService {
  constructor(private em: EntityManager) {}

  async changeDefaultSchedule(userId: number) {
    const anotherSchedule = await this.em.findOne(Schedule, {
      user: { id: userId },
      isDefault: false,
    });

    if (!anotherSchedule) {
      throw new AtLeastOneScheduleException();
    }

    anotherSchedule.isDefault = true;
  }
}
