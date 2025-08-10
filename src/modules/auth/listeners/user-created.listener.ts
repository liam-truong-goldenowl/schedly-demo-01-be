import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';

import { Account } from '@/database/entities/account.entity';
import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

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
