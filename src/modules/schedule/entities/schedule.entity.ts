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

@Entity()
@Filter({ name: 'ownBy', cond: (args) => ({ user: { id: args.id } }) })
export class Schedule extends BaseEntity {
  @ManyToOne({ entity: () => User, serializedName: 'userId' })
  user: User;

  @Property()
  name: string;

  @Property()
  timezone: string;

  @Property({ default: false })
  isDefault?: boolean & Opt;

  @OneToMany({
    entity: () => ScheduleWeeklyHour,
    mappedBy: (hour) => hour.schedule,
    cascade: [Cascade.REMOVE],
  })
  weeklyHours = new Collection<ScheduleWeeklyHour>(this);
}
