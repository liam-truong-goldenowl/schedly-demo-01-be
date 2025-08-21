import { Seeder } from '@mikro-orm/seeder';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { User } from '@/modules/user/entities/user.entity';

import { AccountFactory } from '../factories/account.factory';

export class AccountSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary<User[]>): Promise<void> {
    context.users.forEach(
      (user) => (user.account = new AccountFactory(em).makeOne()),
    );
  }
}
