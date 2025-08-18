import { Seeder } from '@mikro-orm/seeder';
import { randNumber } from '@ngneat/falso';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { DateOverrideFactory } from '../factories/date-override.factory';

export class DateOverrideSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary<Schedule[]>): Promise<void> {
    context.schedules.forEach((schedule: Schedule) => {
      schedule.dateOverrides.set(
        new DateOverrideFactory(em).make(randNumber({ min: 0, max: 1 })),
      );
    });
  }
}
