import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  NotFoundError,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/postgresql';

import { Schedule } from '../entities/schedule.entity';
import { CreateWeeklyHourDto } from '../dto/create-weekly-hour.dto';
import { UpdateWeeklyHourDto } from '../dto/update-weekly-hour.dto';
import { ScheduleWeeklyHour } from '../entities/schedule-weekly-hour.entity';
import { OverlappingHoursException } from '../exceptions/overlapping-hours.exception';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { ScheduleWeeklyHourResponseDto } from '../dto/schedule-weekly-hour-response.dto';
import { WeeklyHourNotFoundException } from '../exceptions/weekly-hour-not-found.exception';

@Injectable()
export class ScheduleWeeklyHourService {
  constructor(private em: EntityManager) {}

  async create(dto: {
    scheduleId: number;
    weeklyHourData: CreateWeeklyHourDto;
  }) {
    const overlappingHours = await this.em.findAll(ScheduleWeeklyHour, {
      filters: {
        overlappingHours: {
          id: dto.scheduleId,
          weekday: dto.weeklyHourData.weekday,
          startTime: dto.weeklyHourData.startTime,
          endTime: dto.weeklyHourData.endTime,
        },
      },
      fields: ['id'],
    });

    if (overlappingHours.length > 0) {
      throw new OverlappingHoursException({
        start: dto.weeklyHourData.startTime,
        end: dto.weeklyHourData.endTime,
        weekday: dto.weeklyHourData.weekday,
      });
    }

    try {
      const weeklyHour = this.em.create(ScheduleWeeklyHour, {
        schedule: this.em.getReference(Schedule, dto.scheduleId),
        endTime: dto.weeklyHourData.endTime,
        startTime: dto.weeklyHourData.startTime,
        weekday: dto.weeklyHourData.weekday,
      });

      await this.em.flush();

      return ScheduleWeeklyHourResponseDto.fromEntity(weeklyHour);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(dto.scheduleId);
      }
    }
  }

  async delete(dto: { scheduleId: number; weeklyHourId: number }) {
    try {
      const weeklyHour = await this.em.findOneOrFail(ScheduleWeeklyHour, {
        id: dto.weeklyHourId,
        schedule: { id: dto.scheduleId },
      });

      await this.em.removeAndFlush(weeklyHour);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ScheduleNotFoundException(dto.weeklyHourId);
      }
    }
  }

  async update(dto: {
    scheduleId: number;
    weeklyHourId: number;
    weeklyHourData: UpdateWeeklyHourDto;
  }) {
    try {
      const weeklyHour = await this.em.findOneOrFail(ScheduleWeeklyHour, {
        id: dto.weeklyHourId,
        schedule: { id: dto.scheduleId },
      });

      weeklyHour.assign(dto.weeklyHourData);

      await this.em.flush();

      return ScheduleWeeklyHourResponseDto.fromEntity(weeklyHour);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(dto.scheduleId);
      } else if (error instanceof NotFoundError) {
        throw new WeeklyHourNotFoundException(dto.weeklyHourId);
      }
    }
  }
}
