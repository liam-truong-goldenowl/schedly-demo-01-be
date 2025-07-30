import {
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

@Entity()
@Filter({ name: 'ownBy', cond: (args) => ({ user: { id: args.id } }) })
export class Schedule extends BaseEntity {
  @ManyToOne({
    entity: () => User,
    serializedName: 'userId',
    serializer: (value) => value.id,
  })
  user: User;

  @Property()
  name: string;

  @Property()
  timezone: string;

  @Property()
  isDefault = true;

  @OneToMany(() => ScheduleWeeklyHour, (weeklyHour) => weeklyHour.schedule)
  weeklyHours = new Collection<ScheduleWeeklyHour>(this);
}
