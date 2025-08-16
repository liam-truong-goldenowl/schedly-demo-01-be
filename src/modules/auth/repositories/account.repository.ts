import { Injectable } from '@nestjs/common';
import { RequiredEntityData } from '@mikro-orm/core';

import { BaseRepository } from '@/common/repositories/base.repository';

import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  async setRefreshToken(userId: number, refreshToken: string) {
    const account = await this.findOne({ user: { id: userId } });
    await account?.setRefreshToken(refreshToken);
    await this.em.flush();
  }

  async unsetRefreshToken(userId: number) {
    const account = await this.findOne({ user: { id: userId } });
    await account?.revokeRefreshToken();
    await this.em.flush();
  }

  async createEntity(data: RequiredEntityData<Account>): Promise<Account> {
    const account = this.create(data);
    await account.setPassword(data.password);
    await this.em.flush();
    return account;
  }
}
