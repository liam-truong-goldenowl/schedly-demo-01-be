import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class UserCreatedListener {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(UserCreatedEvent.name)
  async handleUserCreatedEvent({ payload }: UserCreatedEvent) {
    const schedule = await this.scheduleRepo.createDefaultEntity(
      payload.id,
      payload.timezone,
    );
    await this.eventEmitter.emitAsync(
      ScheduleCreatedEvent.name,
      new ScheduleCreatedEvent({ id: schedule.id }),
    );
  }
}
