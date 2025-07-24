import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { Account } from '@/modules/auth/entities/account.entity';
import { UserSetting } from '@/modules/user-settings/entities/user-setting.entity';

@Entity()
export class User extends BaseEntity {
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
