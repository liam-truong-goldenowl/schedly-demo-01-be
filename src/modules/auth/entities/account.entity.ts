import {
  Entity,
  OneToOne,
  Property,
  EntityRepositoryType,
} from '@mikro-orm/postgresql';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

import { AccountRepository } from '../account.repository';

@Entity({ repository: () => AccountRepository })
export class Account extends BaseEntity {
  [EntityRepositoryType]?: AccountRepository;

  @Property()
  passwordHash: string;

  @OneToOne(() => User)
  user: User;
}
