import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/postgresql';

import { isOverlapping } from '@/utils/helpers/time';

import { Schedule } from '../entities/schedule.entity';
import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { ScheduleDateOverrideResDto } from '../dto/date-override-res.dto';
import { ScheduleDateOverride } from '../entities/schedule-date-override.entity';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { OverlappingIntervalsException } from '../exceptions/overlapping-intervals.exception';
import { DateOverrideNotFoundException } from '../exceptions/date-override-not-found.exception';

@Injectable()
export class ScheduleDateOverrideService {
  constructor(private em: EntityManager) {}
  async create({
    scheduleId,
    dateOverrideData,
  }: {
    scheduleId: number;
    dateOverrideData: CreateDateOverrideDto;
  }) {
    const { intervals } = dateOverrideData;

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
      const existingOverrides = await this.em.find(ScheduleDateOverride, {
        schedule: { id: scheduleId },
        date: dateOverrideData.date,
      });

      if (existingOverrides.length > 0) {
        this.em.remove(existingOverrides);
      }

      const newOverrides = intervals.map((interval) =>
        this.em.create(ScheduleDateOverride, {
          endTime: interval.endTime,
          startTime: interval.startTime,
          date: new Date(dateOverrideData.date),
          schedule: this.em.getReference(Schedule, scheduleId),
        }),
      );

      await this.em.flush();

      return newOverrides.map((override) =>
        ScheduleDateOverrideResDto.fromEntity(override),
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
  }): Promise<ScheduleDateOverrideResDto> {
    const dateOverride = await this.em.findOne(ScheduleDateOverride, {
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

    return ScheduleDateOverrideResDto.fromEntity(dateOverride);
  }

  async delete({
    scheduleId,
    dateOverrideId,
  }: {
    scheduleId: number;
    dateOverrideId: number;
  }): Promise<void> {
    const dateOverride = await this.em.findOne(ScheduleDateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    if (!dateOverride) {
      throw new DateOverrideNotFoundException(dateOverrideId);
    }

    await this.em.removeAndFlush(dateOverride);
  }
}
