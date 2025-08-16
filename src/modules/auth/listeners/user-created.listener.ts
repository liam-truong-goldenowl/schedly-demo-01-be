import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '@/modules/user/events/user-created.event';
import { UserRepository } from '@/modules/user/repositories/user.repository';

import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class UserCreatedListener {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly accountRepo: AccountRepository,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent({ payload }: UserCreatedEvent) {
    const user = this.userRepo.getReference(payload.id);
    await this.accountRepo.createEntity({ user, password: payload.password });
  }
}
