import { Seeder } from '@mikro-orm/seeder';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { UserFactory } from '../factories/user.factory';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.users = new UserFactory(em).make(100);
  }
}
