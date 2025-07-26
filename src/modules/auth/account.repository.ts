import { EntityRepository } from '@mikro-orm/postgresql';

import { Account } from './entities/account.entity';

export class AccountRepository extends EntityRepository<Account> {}
