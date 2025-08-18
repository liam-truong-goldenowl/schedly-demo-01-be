import { Seeder } from '@mikro-orm/seeder';

import type { EntityManager } from '@mikro-orm/core';

import { UserSeeder } from './seeders/UserSeeder';
import { EventSeeder } from './seeders/EventSeeder';
import { AccountSeeder } from './seeders/AccountSeeder';
import { ScheduleSeeder } from './seeders/ScheduleSeeder';
import { WeeklyHourSeeder } from './seeders/WeeklyHourSeeder';
import { DateOverrideSeeder } from './seeders/DateOverrideSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      UserSeeder,
      AccountSeeder,
      ScheduleSeeder,
      WeeklyHourSeeder,
      DateOverrideSeeder,
      EventSeeder,
    ]);
  }
}
