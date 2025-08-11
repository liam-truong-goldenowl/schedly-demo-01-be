import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/database/entities';

import { AtLeastOneScheduleException } from '../exceptions';

@Injectable()
export class ScheduleService {
  constructor(private em: EntityManager) {}

  async changeDefaultSchedule(userId: number) {
    const currentDefault = await this.em.findOneOrFail(Schedule, {
      user: { id: userId },
      isDefault: true,
    });

    const newDefault = await this.em.findOne(
      Schedule,
      {
        user: { id: userId },
        isDefault: false,
      },
      {
        orderBy: {
          createdAt: 'DESC',
        },
      },
    );

    if (!newDefault) {
      throw new AtLeastOneScheduleException();
    }

    currentDefault.isDefault = false;
    newDefault.isDefault = true;

    await this.em.flush();
  }
}
