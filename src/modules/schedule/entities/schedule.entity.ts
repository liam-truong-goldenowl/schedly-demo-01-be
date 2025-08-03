import {
  Opt,
  Entity,
  Filter,
  Cascade,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/postgresql';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

import { ScheduleWeeklyHour } from './schedule-weekly-hour.entity';
import { ScheduleDateOverride } from './schedule-date-override.entity';

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
    entity: () => ScheduleWeeklyHour,
    mappedBy: (hour) => hour.schedule,
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  weeklyHours = new Collection<ScheduleWeeklyHour>(this);

  @OneToMany({
    entity: () => ScheduleDateOverride,
    mappedBy: (override) => override.schedule,
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  dateOverrides = new Collection<ScheduleDateOverride>(this);
}
