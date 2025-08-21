import { Factory } from '@mikro-orm/seeder';
import { randPassword } from '@ngneat/falso';

import { Account } from '@/modules/auth/entities/account.entity';

export class AccountFactory extends Factory<Account> {
  model = Account;

  definition(): Partial<Account> {
    return {
      password: randPassword(),
    };
  }
}
