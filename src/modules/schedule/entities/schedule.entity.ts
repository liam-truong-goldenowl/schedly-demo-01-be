import {
  Opt,
  Entity,
  Filter,
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
    orphanRemoval: true,
  })
  weeklyHours = new Collection<ScheduleWeeklyHour>(this);

  @OneToMany({
    entity: () => ScheduleDateOverride,
    mappedBy: (override) => override.schedule,
    orphanRemoval: true,
  })
  dateOverrides = new Collection<ScheduleDateOverride>(this);
}
