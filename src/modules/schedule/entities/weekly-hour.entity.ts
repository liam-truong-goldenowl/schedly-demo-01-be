import {
  Enum,
  Entity,
  Property,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { Weekday } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';

import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

import { Schedule } from './schedule.entity';

@Entity({ repository: () => WeeklyHourRepository })
export class WeeklyHour extends BaseEntity {
  [EntityRepositoryType]?: WeeklyHourRepository;

  @Enum({ items: () => Weekday, nativeEnumName: 'weekday' })
  weekday: Weekday;

  @Property({ type: 'time' })
  startTime: string;

  @Property({ type: 'time' })
  endTime: string;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
    deleteRule: 'cascade',
    lazy: true,
  })
  schedule: Schedule;
}
