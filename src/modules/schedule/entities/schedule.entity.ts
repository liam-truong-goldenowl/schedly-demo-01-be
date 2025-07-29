import { Entity, Property, ManyToOne } from '@mikro-orm/postgresql';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class Schedule extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Property()
  name: string;

  @Property()
  timezone: string;

  @Property()
  isDefault = true;
}
