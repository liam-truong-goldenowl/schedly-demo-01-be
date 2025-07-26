import {
  Entity,
  OneToOne,
  Property,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { Account } from '@/modules/auth/entities/account.entity';
import { UserSetting } from '@/modules/user-setting/entities/user-setting.entity';

import { UserRepository } from '../user.repository';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  constructor(dto: { email: string; name: string; publicSlug: string }) {
    super();
    this.name = dto.name;
    this.email = dto.email;
    this.publicSlug = dto.publicSlug;
  }

  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true, length: 255 })
  email: string;

  @Property({ length: 255 })
  name: string;

  @Property({ nullable: true, length: 255 })
  avatarUrl?: string;

  @Property({ unique: true, length: 255 })
  publicSlug: string;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToOne(() => UserSetting, (settings) => settings.user)
  settings: UserSetting;
}
