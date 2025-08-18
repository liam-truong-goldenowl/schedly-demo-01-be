import { Seeder } from '@mikro-orm/seeder';
import { randNumber } from '@ngneat/falso';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { User } from '@/modules/user/entities/user.entity';

import { ScheduleFactory } from '../factories/schedule.factory';

export class ScheduleSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.schedules = [];

    context.users.forEach((user: User) => {
      const schedules = [
        new ScheduleFactory(em).makeDefault(),
        ...new ScheduleFactory(em).make(randNumber({ min: 0, max: 4 })),
      ];
      user.schedules.set(schedules);
      context.schedules.push(...schedules);
    });
  }
}
