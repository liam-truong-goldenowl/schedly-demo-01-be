import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@mikro-orm/nestjs';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';

import { Account } from '../entities/account.entity';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class UserCreatedListener {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: AccountRepository,
  ) {}

  @OnEvent(UserCreatedEvent.name)
  async handleUserCreatedEvent({ payload }: UserCreatedEvent) {
    await this.accountRepo.createEntity({
      user: payload.id,
      password: payload.password,
    });
  }
}
