import {
  Opt,
  Entity,
  OneToOne,
  Property,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { Account } from '@/modules/auth/entities/account.entity';

import { UserRepository } from '../repositories/user.repository';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true, length: 255 })
  email: string;

  @Property({ length: 255 })
  name: string;

  @Property({ nullable: true, length: 255 })
  avatarUrl?: string;

  @Property({ unique: true, length: 255 })
  slug: string;

  @OneToOne(() => Account, (account) => account.user)
  account: Account & Opt;
}
