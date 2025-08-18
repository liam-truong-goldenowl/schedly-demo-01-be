import {
  Opt,
  Entity,
  Filter,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Event } from '@/modules/event/entities/event.entity';

import { ScheduleRepository } from '../repositories/schedule.repository';

import { WeeklyHour } from './weekly-hour.entity';
import { DateOverride } from './date-override.entity';

@Entity({ repository: () => ScheduleRepository })
@Filter({ name: 'ownBy', cond: (args) => ({ user: { id: args.id } }) })
export class Schedule extends BaseEntity {
  [EntityRepositoryType]?: ScheduleRepository;

  @Property()
  name: string;

  @Property()
  timezone: string;

  @Property({ default: false })
  isDefault?: boolean & Opt;

  @ManyToOne({ entity: () => User, serializedName: 'userId', lazy: true })
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

  @OneToMany({
    entity: () => Event,
    mappedBy: (event) => event.schedule,
    orphanRemoval: true,
  })
  events = new Collection<Event>(this);
}
