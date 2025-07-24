import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity()
export class Account extends BaseEntity {
  @Property()
  passwordHash: string;

  @OneToOne(() => User)
  user: User;
}
