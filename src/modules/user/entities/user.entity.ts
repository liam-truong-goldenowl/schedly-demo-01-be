import {
  Opt,
  Entity,
  OneToOne,
  Property,
  BeforeCreate,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { SlugHelper } from '@/common/utils/helpers/slug.helper';
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
  slug: string & Opt;

  @OneToOne({
    entity: () => Account,
    mappedBy: (account) => account.user,
    lazy: true,
  })
  account: Account & Opt;

  @BeforeCreate()
  async generateSlug() {
    this.slug = await SlugHelper.generateUnique(this.name);
  }
}
