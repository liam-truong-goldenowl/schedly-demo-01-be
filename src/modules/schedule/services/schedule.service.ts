import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@/modules/user/entities/user.entity';

import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleResponseDto } from '../dto/schedule-response.dto';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { AtLeastOneScheduleException } from '../exceptions/at-least-one-schedule.exception';

@Injectable()
export class ScheduleService {
  constructor(
    private em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllForUser({ userId }: { userId: number }) {
    const schedules = await this.em.findAll(Schedule, {
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours', 'dateOverrides'],
    });
    return schedules.map((schedule) =>
      ScheduleResponseDto.fromEntity(schedule),
    );
  }

  async createForUser(dto: {
    scheduleData: CreateScheduleDto;
    userId: number;
  }) {
    const schedule = this.em.create(Schedule, {
      name: dto.scheduleData.name,
      timezone: dto.scheduleData.timezone,
      user: this.em.getReference(User, dto.userId),
    });

    await this.em.flush();

    await this.eventEmitter.emitAsync(
      'schedule.created',
      new ScheduleCreatedEvent({ id: schedule.id }),
    );

    return ScheduleResponseDto.fromEntity(schedule);
  }

  async updateForUser(dto: {
    userId: number;
    scheduleId: number;
    scheduleData: UpdateScheduleDto;
  }) {
    const schedule = await this.em.findOne(Schedule, {
      id: dto.scheduleId,
      user: { id: dto.userId },
    });

    if (!schedule) {
      throw new ScheduleNotFoundException(dto.scheduleId);
    }

    schedule.assign(dto.scheduleData);

    await this.em.flush();

    await schedule.populate(['weeklyHours', 'dateOverrides']);

    return ScheduleResponseDto.fromEntity(schedule);
  }

  async deleteFromUser(dto: { userId: number; scheduleId: number }) {
    const schedule = await this.em.findOne(Schedule, {
      id: dto.scheduleId,
      user: { id: dto.userId },
    });

    if (!schedule) {
      throw new ScheduleNotFoundException(dto.scheduleId);
    }

    if (schedule.isDefault) {
      const anotherSchedule = await this.em.findOne(Schedule, {
        user: { id: dto.userId },
        isDefault: false,
      });

      if (!anotherSchedule) {
        throw new AtLeastOneScheduleException();
      }

      anotherSchedule.isDefault = true;
      await this.em.flush();
    }

    await this.em.removeAndFlush(schedule);
  }
}
