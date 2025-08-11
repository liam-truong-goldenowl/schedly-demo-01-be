import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User, Schedule } from '@/database/entities';

import { CreateScheduleDto } from '../dto';
import { ScheduleMapper } from '../mappers';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    private em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(input: { userId: number; scheduleData: CreateScheduleDto }) {
    const schedule = this.em.create(Schedule, {
      name: input.scheduleData.name,
      timezone: input.scheduleData.timezone,
      user: this.em.getReference(User, input.userId),
    });
    await this.em.flush();

    await this.eventEmitter.emitAsync(
      'schedule.created',
      new ScheduleCreatedEvent({ id: schedule.id }),
    );

    return ScheduleMapper.toResponse(schedule);
  }
}
