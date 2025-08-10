import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/postgresql';

import { isOverlapping } from '@/utils/helpers/time';
import { Schedule } from '@/database/entities/schedule.entity';
import { DateOverride } from '@/database/entities/date-override.entity';

import { DateOverrideResDto } from '../dto/override-res.dto';
import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { OverlappingIntervalsException } from '../exceptions/overlapping-intervals.exception';
import { DateOverrideNotFoundException } from '../exceptions/date-override-not-found.exception';

@Injectable()
export class DateOverrideService {
  constructor(private em: EntityManager) {}
  async create({
    scheduleId,
    dateOverrideData,
  }: {
    scheduleId: number;
    dateOverrideData: CreateDateOverrideDto;
  }) {
    const { intervals, dates } = dateOverrideData;

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

    try {
      const existingOverrides = await this.em.find(DateOverride, {
        schedule: { id: scheduleId },
        date: { $in: dates.map((date) => new Date(date)) },
      });

      if (existingOverrides.length > 0) {
        this.em.remove(existingOverrides);
      }

      if (intervals.length == 0) {
        const newOverrides = dates.map((date) =>
          this.em.create(DateOverride, {
            date: new Date(date),
            schedule: this.em.getReference(Schedule, scheduleId),
            startTime: null,
            endTime: null,
          }),
        );
        await this.em.flush();

        return newOverrides.map((override) =>
          DateOverrideResDto.fromEntity(override),
        );
      }

      const newOverrides = intervals.flatMap((interval) => {
        return dates.map((date) =>
          this.em.create(DateOverride, {
            date: new Date(date),
            startTime: interval.startTime,
            endTime: interval.endTime,
            schedule: this.em.getReference(Schedule, scheduleId),
          }),
        );
      });

      await this.em.flush();

      return newOverrides.map((override) =>
        DateOverrideResDto.fromEntity(override),
      );
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(scheduleId);
      }

      throw error;
    }
  }

  async update({
    scheduleId,
    dateOverrideId,
    dateOverrideData,
  }: {
    scheduleId: number;
    dateOverrideId: number;
    dateOverrideData: UpdateDateOverrideDto;
  }): Promise<DateOverrideResDto> {
    const dateOverride = await this.em.findOne(DateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    if (!dateOverride) {
      throw new DateOverrideNotFoundException(dateOverrideId);
    }

    this.em.assign(dateOverride, {
      startTime: dateOverrideData.startTime,
      endTime: dateOverrideData.endTime,
    });

    await this.em.flush();

    return DateOverrideResDto.fromEntity(dateOverride);
  }

  async delete({
    scheduleId,
    dateOverrideId,
  }: {
    scheduleId: number;
    dateOverrideId: number;
  }): Promise<void> {
    const dateOverride = await this.em.findOne(DateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    if (!dateOverride) {
      throw new DateOverrideNotFoundException(dateOverrideId);
    }

    await this.em.removeAndFlush(dateOverride);
  }
}
