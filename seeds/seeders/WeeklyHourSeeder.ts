import { Seeder } from '@mikro-orm/seeder';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { WeeklyHourFactory } from '../factories/weekly-hour.factory';

export class WeeklyHourSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary<Schedule[]>): Promise<void> {
    context.schedules.forEach((schedule: Schedule) => {
      schedule.weeklyHours.set(new WeeklyHourFactory(em).makeDefault());
    });
  }
}
