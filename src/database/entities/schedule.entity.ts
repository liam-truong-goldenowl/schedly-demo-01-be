import {
  Opt,
  Entity,
  Filter,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/postgresql';

import { User } from '@/database/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';

import { WeeklyHour } from './weekly-hour.entity';
import { DateOverride } from './date-override.entity';

@Entity()
@Filter({ name: 'ownBy', cond: (args) => ({ user: { id: args.id } }) })
export class Schedule extends BaseEntity {
  @Property()
  name: string;

  @Property()
  timezone: string;

  @Property({ default: false })
  isDefault?: boolean & Opt;

  @ManyToOne({ entity: () => User, serializedName: 'userId' })
  user: User;

  @OneToMany({
    entity: () => WeeklyHour,
    mappedBy: (hour) => hour.schedule,
    orphanRemoval: true,
  })
  weeklyHours = new Collection<WeeklyHour>(this);

  @OneToMany({
    entity: () => DateOverride,
    mappedBy: (override) => override.schedule,
    orphanRemoval: true,
  })
  dateOverrides = new Collection<DateOverride>(this);
}
