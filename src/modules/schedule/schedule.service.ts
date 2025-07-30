import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import type { User } from '../user/entities/user.entity';

import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(private em: EntityManager) {}

  async findAllForUser({ userId }: { userId: User['id'] }) {
    const schedules = await this.em.findAll(Schedule, {
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours'],
    });
    return schedules;
  }
}
