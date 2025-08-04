import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { UserSetting } from '../entities/user-setting.entity';

@Injectable()
export class UserCreatedListener {
  constructor(private em: EntityManager) {}

  @OnEvent(UserCreatedEvent.eventName)
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    this.em.create(UserSetting, {
      timezone: event.payload.timezone,
      user: event.payload.id,
    });

    await this.em.flush();
  }
}
