import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { Account } from '../entities/account.entity';

@Injectable()
export class UserCreatedListener {
  constructor(private em: EntityManager) {}

  @OnEvent(UserCreatedEvent.eventName)
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const account = this.em.create(Account, { user: event.payload.id });

    account.setPassword(event.payload.password);

    await this.em.flush();
  }
}
