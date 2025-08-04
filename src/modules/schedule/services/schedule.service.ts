import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@/modules/user/entities/user.entity';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleResDto } from '../dto/schedule-res.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleNotFoundException } from '../exceptions/schedule-not-found.exception';
import { AtLeastOneScheduleException } from '../exceptions/at-least-one-schedule.exception';

@Injectable()
export class ScheduleService {
  constructor(
    private em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAllForUser({
    userId,
  }: {
    userId: number;
  }): Promise<ScheduleResDto[]> {
    const schedules = await this.em.findAll(Schedule, {
      filters: { ownBy: { id: userId } },
      populate: ['weeklyHours', 'dateOverrides'],
    });

    return schedules.map((schedule) => ScheduleResDto.fromEntity(schedule));
  }

  async createForUser({
    userId,
    scheduleData,
  }: {
    userId: number;
    scheduleData: CreateScheduleDto;
  }): Promise<ScheduleResDto> {
    const schedule = this.em.create(Schedule, {
      name: scheduleData.name,
      timezone: scheduleData.timezone,
      user: this.em.getReference(User, userId),
    });

    await this.em.flush();

    await this.eventEmitter.emitAsync(
      ScheduleCreatedEvent.eventName,
      new ScheduleCreatedEvent({ id: schedule.id }),
    );

    return ScheduleResDto.fromEntity(schedule);
  }

  async updateForUser({
    userId,
    scheduleId,
    scheduleData,
  }: {
    userId: number;
    scheduleId: number;
    scheduleData: UpdateScheduleDto;
  }): Promise<ScheduleResDto> {
    const schedule = await this.em.findOne(Schedule, {
      id: scheduleId,
      user: { id: userId },
    });

    if (!schedule) {
      throw new ScheduleNotFoundException(scheduleId);
    }

    schedule.assign(scheduleData);

    await this.em.flush();

    await schedule.populate(['weeklyHours', 'dateOverrides']);

    return ScheduleResDto.fromEntity(schedule);
  }

  async deleteFromUser({
    userId,
    scheduleId,
  }: {
    userId: number;
    scheduleId: number;
  }): Promise<void> {
    const schedule = await this.em.findOne(Schedule, {
      id: scheduleId,
      user: { id: userId },
    });

    if (!schedule) {
      throw new ScheduleNotFoundException(scheduleId);
    }

    if (schedule.isDefault) {
      const anotherSchedule = await this.em.findOne(Schedule, {
        user: { id: userId },
        isDefault: false,
      });

      if (!anotherSchedule) {
        throw new AtLeastOneScheduleException();
      }

      anotherSchedule.isDefault = true;
      await this.em.flush();
    }

    await schedule.populate(['weeklyHours', 'dateOverrides']);
    await this.em.removeAndFlush(schedule);
  }
}
