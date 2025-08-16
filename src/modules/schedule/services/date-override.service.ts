import { Injectable } from '@nestjs/common';

import { Interval } from '@/common/interfaces';
import { ArrayHelper } from '@/common/utils/helpers/array.helper';
import { DateTimeHelper } from '@/common/utils/helpers/datetime.helper';

import { ScheduleRepository } from '../repositories/schedule.repository';
import { DateOverrideRepository } from '../repositories/date-override.repository';
import { OverlappingIntervalsException } from '../exceptions/overlapping-intervals.exception';

@Injectable()
export class DateOverrideService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly dateOverrideRepo: DateOverrideRepository,
  ) {}

  async detectOverlappingIntervals(intervals: Interval[]) {
    const combinations = ArrayHelper.getCombinations(intervals, 2);
    const overlap = combinations.some(([current, comparing]) =>
      DateTimeHelper.timeRangesOverlap(current, comparing),
    );
    if (overlap) {
      throw new OverlappingIntervalsException();
    }
  }

  async removeExistingOverrides(scheduleId: number, dates: Date[]) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    await this.dateOverrideRepo.deleteEntity({
      schedule,
      date: { $in: dates },
    });
  }

  async createDateOverrides(
    scheduleId: number,
    { dates, intervals }: { dates: Date[]; intervals: Interval[] },
  ) {
    const newOverrides =
      intervals.length > 0
        ? await this.createAvailableOverrides(scheduleId, { dates, intervals })
        : await this.createUnavailableOverrides(scheduleId, { dates });
    return newOverrides;
  }

  async createUnavailableOverrides(
    scheduleId: number,
    { dates }: { dates: Date[] },
  ) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    const newOverrides = await this.dateOverrideRepo.createManyEntities(
      dates.map((date) => ({ schedule, date })),
    );
    return newOverrides;
  }

  async createAvailableOverrides(
    scheduleId: number,
    { dates, intervals }: { dates: Date[]; intervals: Interval[] },
  ) {
    const schedule = this.scheduleRepo.getReference(scheduleId);
    const data = dates.flatMap((date) =>
      intervals.map((interval) => ({ date, schedule, ...interval })),
    );
    const newOverrides = await this.dateOverrideRepo.createManyEntities(data);
    return newOverrides;
  }
}
