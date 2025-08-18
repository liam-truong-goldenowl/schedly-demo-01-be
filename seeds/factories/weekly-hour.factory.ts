import { Factory } from '@mikro-orm/seeder';
import { randWeekday } from '@ngneat/falso';
import { getRandomWholeHourInterval } from 'seeds/utitls';

import { Weekday } from '@/common/enums';
import { WeeklyHour } from '@/modules/schedule/entities/weekly-hour.entity';

export class WeeklyHourFactory extends Factory<WeeklyHour> {
  model = WeeklyHour;

  definition(): Partial<WeeklyHour> {
    const { startTime, endTime } = getRandomWholeHourInterval(8);
    return {
      weekday: Weekday[randWeekday().toUpperCase()],
      startTime,
      endTime,
    };
  }

  makeDefault(): WeeklyHour[] {
    const startWorkingDay = this.makeOne({
      weekday: Weekday.MONDAY,
      startTime: '09:00',
      endTime: '16:00',
    });
    const midWorkingDays = [
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
    ].map((day) =>
      this.makeOne({
        weekday: day,
        startTime: '09:00',
        endTime: '17:00',
      }),
    );
    const endWorkingDay = this.makeOne({
      weekday: Weekday.FRIDAY,
      startTime: '09:00',
      endTime: '16:00',
    });
    const workingDays = [startWorkingDay, ...midWorkingDays, endWorkingDay];
    return workingDays;
  }
}
