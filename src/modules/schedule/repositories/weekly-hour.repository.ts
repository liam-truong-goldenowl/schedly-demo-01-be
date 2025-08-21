import { Injectable } from '@nestjs/common';
import { FilterQuery } from '@mikro-orm/core';

import { Weekday } from '@/common/enums';
import { BaseRepository } from '@/common/repositories/base.repository';

import { Schedule } from '../entities/schedule.entity';
import { WeeklyHour } from '../entities/weekly-hour.entity';
import { OverlappingHoursException } from '../exceptions/overlapping-hours.exception';

@Injectable()
export class WeeklyHourRepository extends BaseRepository<WeeklyHour> {
  async ensureNoOverlap(filter: FilterQuery<WeeklyHour>) {
    const overlapping = await this.count(filter);
    if (overlapping > 0) {
      throw new OverlappingHoursException();
    }
  }

  async createDefaultEntities(scheduleId: number): Promise<WeeklyHour[]> {
    const startTime = '09:00';
    const endTime = '17:00';
    const defaultDays = [
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
    ];
    const schedule = this.em.getReference(Schedule, scheduleId);
    return await this.createManyEntities(
      defaultDays.map((weekday) => ({ schedule, endTime, startTime, weekday })),
    );
  }
}
