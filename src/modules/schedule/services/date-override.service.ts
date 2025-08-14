import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Interval } from '@/common/interfaces';
import { isOverlapping } from '@/utils/helpers/time';
import { Schedule, DateOverride } from '@/database/entities';

import { OverlappingIntervalsException } from '../exceptions';

@Injectable()
export class DateOverrideService {
  constructor(private em: EntityManager) {}

  async checkOverlappingIntervals(intervals: Interval[]) {
    for (const [idx, currentInterval] of intervals.entries()) {
      for (const comparingInterval of intervals.slice(idx + 1)) {
        if (isOverlapping(currentInterval, comparingInterval)) {
          throw new OverlappingIntervalsException(
            currentInterval,
            comparingInterval,
          );
        }
      }
    }
  }

  async removeExistingOverrides(scheduleId: number, dates: string[]) {
    const existingOverrides = await this.em.find(DateOverride, {
      schedule: { id: scheduleId },
      date: { $in: dates },
    });

    if (existingOverrides.length > 0) {
      this.em.remove(existingOverrides);
    }

    await this.em.flush();
  }

  async createUnavailableOverrides(scheduleId: number, dates: string[]) {
    const scheduleRef = this.em.getReference(Schedule, scheduleId);
    const newOverrides = dates.map((date) =>
      this.em.create(DateOverride, {
        schedule: scheduleRef,
        date: new Date(date),
        startTime: null,
        endTime: null,
      }),
    );
    await this.em.flush();
    return newOverrides;
  }

  async createAvailableOverrides(
    scheduleId: number,
    { dates, intervals }: { dates: string[]; intervals: Interval[] },
  ) {
    const scheduleRef = this.em.getReference(Schedule, scheduleId);
    const newOverrides = intervals.flatMap((interval) => {
      return dates.map((date) =>
        this.em.create(DateOverride, {
          date: new Date(date),
          schedule: scheduleRef,
          startTime: interval.startTime,
          endTime: interval.endTime,
        }),
      );
    });
    await this.em.flush();
    return newOverrides;
  }
}
