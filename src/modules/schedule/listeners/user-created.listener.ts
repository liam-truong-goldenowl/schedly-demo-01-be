import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class UserCreatedListener {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent({ payload }: UserCreatedEvent) {
    const schedule = await this.scheduleRepo.createDefaultEntity(
      payload.id,
      payload.timezone,
    );
    await this.eventEmitter.emitAsync(
      'schedule.created',
      new ScheduleCreatedEvent({ id: schedule.id }),
    );
  }
}
