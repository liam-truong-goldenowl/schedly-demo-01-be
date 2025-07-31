import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  NotFoundError,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/postgresql';

import { isOverlapping } from '@/utils/helpers/time';

import { Schedule } from '../entities/schedule.entity';
import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { ScheduleDateOverride } from '../entities/schedule-date-override.entity';
import { ScheduleDateOverrideResponseDto } from '../dto/date-override-response.dto';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { OverlappingIntervalsException } from '../exceptions/overlapping-intervals.exception';
import { DateOverrideNotFoundException } from '../exceptions/date-override-not-found.exception';

@Injectable()
export class ScheduleDateOverrideService {
  constructor(private em: EntityManager) {}
  async create(dto: {
    scheduleId: number;
    dateOverrideData: CreateDateOverrideDto;
  }) {
    const { intervals } = dto.dateOverrideData;

    if (intervals.length > 1) {
      intervals.forEach((interval, index) => {
        const nextIntervals = intervals.slice(index + 1);
        nextIntervals.forEach((nextInterval) => {
          if (isOverlapping(interval, nextInterval)) {
            throw new OverlappingIntervalsException(interval, nextInterval);
          }
        });
      });
    }

    try {
      const existingOverrides = await this.em.find(ScheduleDateOverride, {
        schedule: { id: dto.scheduleId },
        date: dto.dateOverrideData.date,
      });

      if (existingOverrides.length > 0) {
        this.em.remove(existingOverrides);
      }

      const newOverrides = intervals.map((interval) =>
        this.em.create(ScheduleDateOverride, {
          date: new Date(dto.dateOverrideData.date),
          startTime: interval.startTime,
          endTime: interval.endTime,
          schedule: this.em.getReference(Schedule, dto.scheduleId),
        }),
      );

      await this.em.flush();

      return newOverrides.map((override) =>
        ScheduleDateOverrideResponseDto.fromEntity(override),
      );
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(dto.scheduleId);
      }
    }
  }

  async update(dto: {
    scheduleId: number;
    dateOverrideId: number;
    dateOverrideData: UpdateDateOverrideDto;
  }) {
    try {
      const dateOverride = await this.em.findOneOrFail(ScheduleDateOverride, {
        id: dto.dateOverrideId,
        schedule: { id: dto.scheduleId },
      });

      this.em.assign(dateOverride, {
        startTime: dto.dateOverrideData.startTime,
        endTime: dto.dateOverrideData.endTime,
      });

      await this.em.flush();

      return ScheduleDateOverrideResponseDto.fromEntity(dateOverride);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new DateOverrideNotFoundException(dto.dateOverrideId);
      }
    }
  }

  async delete(dto: { scheduleId: number; dateOverrideId: number }) {
    try {
      const dateOverride = await this.em.findOneOrFail(ScheduleDateOverride, {
        id: dto.dateOverrideId,
        schedule: { id: dto.scheduleId },
      });

      await this.em.removeAndFlush(dateOverride);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new DateOverrideNotFoundException(dto.dateOverrideId);
      }
    }
  }
}
