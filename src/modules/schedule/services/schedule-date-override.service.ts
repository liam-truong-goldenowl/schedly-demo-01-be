import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  NotFoundError,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/postgresql';

import { Schedule } from '../entities/schedule.entity';
import { CreateDateOverrideDto } from '../dto/create-date-override.dto';
import { UpdateDateOverrideDto } from '../dto/update-date-override.dto';
import { ScheduleDateOverride } from '../entities/schedule-date-override.entity';
import { ScheduleDateOverrideResponseDto } from '../dto/date-override-response.dto';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { DateOverrideNotFoundException } from '../exceptions/date-override-not-found.exception';

@Injectable()
export class ScheduleDateOverrideService {
  constructor(private em: EntityManager) {}
  async create(dto: {
    scheduleId: number;
    dateOverrideData: CreateDateOverrideDto;
  }) {
    try {
      const existingOverride = await this.em.findOne(ScheduleDateOverride, {
        schedule: { id: dto.scheduleId },
        date: dto.dateOverrideData.date,
      });

      if (existingOverride) {
        existingOverride.startTime = dto.dateOverrideData.startTime;
        existingOverride.endTime = dto.dateOverrideData.endTime;

        await this.em.flush();

        return ScheduleDateOverrideResponseDto.fromEntity(existingOverride);
      }

      // if no existing override, create a new one
      const dateOverride = this.em.create(ScheduleDateOverride, {
        date: new Date(dto.dateOverrideData.date),
        startTime: dto.dateOverrideData.startTime,
        endTime: dto.dateOverrideData.endTime,
        schedule: this.em.getReference(Schedule, dto.scheduleId),
      });

      await this.em.flush();

      return ScheduleDateOverrideResponseDto.fromEntity(dateOverride);
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
