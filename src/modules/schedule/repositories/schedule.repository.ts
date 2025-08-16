import { FilterQuery } from '@mikro-orm/core';

import { User } from '@/modules/user/entities/user.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

import { Schedule } from '../entities/schedule.entity';
import { AtLeastOneScheduleException } from '../exceptions/at-least-one-schedule.exception';

export class ScheduleRepository extends BaseRepository<Schedule> {
  async createDefaultEntity(
    userId: number,
    timezone: string,
  ): Promise<Schedule> {
    const user = this.em.getReference(User, userId);
    const schedule = await this.createEntity({
      user,
      isDefault: true,
      name: 'Office hours',
      timezone,
    });
    return schedule;
  }

  async deleteEntity(filter: FilterQuery<Schedule>): Promise<void> {
    const schedule = await this.findOneOrThrow(filter);

    if (schedule.isDefault) {
      await this.changeDefaultSchedule(schedule.user.id);
    }

    this.em.remove(schedule);
    await this.em.flush();
  }

  async changeDefaultSchedule(userId: number): Promise<void> {
    const newDefault = await this.findOne(
      { user: userId, isDefault: false },
      { orderBy: { createdAt: 'DESC' } },
    );
    if (!newDefault) {
      throw new AtLeastOneScheduleException();
    }
    newDefault.isDefault = true;
    await this.em.flush();
  }
}
