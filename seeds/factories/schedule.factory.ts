import { Factory } from '@mikro-orm/seeder';
import { randTimeZone, randCompanyName } from '@ngneat/falso';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';

export class ScheduleFactory extends Factory<Schedule> {
  model = Schedule;

  definition(): Partial<Schedule> {
    return {
      name: `${randCompanyName()}'s hours`,
      timezone: randTimeZone(),
      isDefault: false,
    };
  }

  makeDefault() {
    return this.makeOne({
      name: 'Personal hours',
      isDefault: true,
    });
  }
}
