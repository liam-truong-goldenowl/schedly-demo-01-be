import { Enum, Entity, Property, ManyToOne } from '@mikro-orm/core';

import { Weekday } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';

import { Schedule } from './schedule.entity';

@Entity()
export class ScheduleWeeklyHour extends BaseEntity {
  @Enum({ items: () => Weekday, nativeEnumName: 'weekday' })
  weekday: Weekday;

  @Property({ type: 'time' })
  startTime: string; // e.g., '08:00'

  @Property({ type: 'time' })
  endTime: string; // e.g., '17:00'

  @ManyToOne({ entity: () => Schedule, serializedName: 'scheduleId' })
  schedule: Schedule;
}
