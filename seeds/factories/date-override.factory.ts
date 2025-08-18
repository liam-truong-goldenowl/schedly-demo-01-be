import { Factory } from '@mikro-orm/seeder';
import { getRandomWholeHourInterval } from 'seeds/utitls';
import { randSoonDate, randChanceBoolean } from '@ngneat/falso';

import { DateOverride } from '@/modules/schedule/entities/date-override.entity';

export class DateOverrideFactory extends Factory<DateOverride> {
  model = DateOverride;

  definition(): Partial<DateOverride> {
    const isAvailable = randChanceBoolean({ chanceTrue: 0.75 });
    const { startTime, endTime } = isAvailable
      ? getRandomWholeHourInterval(6)
      : { startTime: undefined, endTime: undefined };
    return {
      date: randSoonDate({ days: 60 }).toISOString().split('T')[0],
      startTime,
      endTime,
    };
  }
}
