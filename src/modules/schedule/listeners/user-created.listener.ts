import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@/modules/user/entities/user.entity';
import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';

@Injectable()
export class UserCreatedListener {
  constructor(
    private em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    // TODO: handle default name and timezone
    const schedule = this.em.create(Schedule, {
      isDefault: true,
      name: 'Working hours',
      timezone: 'Asia/SaiGon',
      user: this.em.getReference(User, event.user.id),
    });

    /**
     * Do not use Promise.all here.
     * The `id` of schedule is `undefined` before persistAndFlush call.
     */
    await this.em.persistAndFlush(schedule);

    await this.eventEmitter.emitAsync(
      'schedule.created',
      new ScheduleCreatedEvent({ id: schedule.id }),
    );
  }
}
