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
import { ScheduleWeeklyHourResDto } from '../dto/schedule-weekly-hour-res.dto';
import { OverlappingHoursException } from '../exceptions/overlapping-hours.exception';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { WeeklyHourNotFoundException } from '../exceptions/weekly-hour-not-found.exception';

@Injectable()
export class ScheduleWeeklyHourService {
  constructor(private em: EntityManager) {}

  async create({
    scheduleId,
    weeklyHourData,
  }: {
    scheduleId: number;
    weeklyHourData: CreateWeeklyHourDto;
  }): Promise<ScheduleWeeklyHourResDto> {
    const overlappingHoursCount = await this.em.count(ScheduleWeeklyHour, {
      weekday: weeklyHourData.weekday,
      schedule: { id: scheduleId },
      startTime: { $lte: weeklyHourData.endTime },
      endTime: { $gte: weeklyHourData.startTime },
    });

    if (overlappingHoursCount > 0) {
      throw new OverlappingHoursException({
        weekday: weeklyHourData.weekday,
        start: weeklyHourData.startTime,
        end: weeklyHourData.endTime,
      });
    }

    try {
      const weeklyHour = this.em.create(ScheduleWeeklyHour, {
        schedule: this.em.getReference(Schedule, scheduleId),
        weekday: weeklyHourData.weekday,
        endTime: weeklyHourData.endTime,
        startTime: weeklyHourData.startTime,
      });

      await this.em.flush();

      return ScheduleWeeklyHourResDto.fromEntity(weeklyHour);
    } catch (error) {
      /**
       * If the schedule does not exist, we throw a ScheduleNotFoundException.
       */
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(scheduleId);
      }

      throw error;
    }
  }

  async delete({
    scheduleId,
    weeklyHourId,
  }: {
    scheduleId: number;
    weeklyHourId: number;
  }): Promise<void> {
    try {
      const weeklyHour = await this.em.findOneOrFail(ScheduleWeeklyHour, {
        id: weeklyHourId,
        schedule: { id: scheduleId },
      });

      await this.em.removeAndFlush(weeklyHour);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ScheduleNotFoundException(weeklyHourId);
      }

      throw error;
    }
  }

  async update({
    scheduleId,
    weeklyHourId,
    weeklyHourData,
  }: {
    scheduleId: number;
    weeklyHourId: number;
    weeklyHourData: UpdateWeeklyHourDto;
  }): Promise<ScheduleWeeklyHourResDto> {
    try {
      const weeklyHour = await this.em.findOneOrFail(ScheduleWeeklyHour, {
        id: weeklyHourId,
        schedule: { id: scheduleId },
      });

      weeklyHour.assign(weeklyHourData);

      await this.em.flush();

      return ScheduleWeeklyHourResDto.fromEntity(weeklyHour);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintViolationException) {
        throw new ScheduleNotFoundException(scheduleId);
      }

      if (error instanceof NotFoundError) {
        throw new WeeklyHourNotFoundException(weeklyHourId);
      }

      throw error;
    }
  }
}
