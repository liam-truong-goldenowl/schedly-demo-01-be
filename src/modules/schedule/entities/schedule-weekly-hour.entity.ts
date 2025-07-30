import { Enum, Entity, Filter, Property, ManyToOne } from '@mikro-orm/core';

import { Weekday } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';

import { Schedule } from './schedule.entity';

@Entity()
@Filter({
  name: 'overlappingHours',
  cond: (args) => ({
    weekday: args.weekday,
    schedule: { id: args.id },
    startTime: { $lte: args.endTime },
    endTime: { $gte: args.startTime },
  }),
})
export class ScheduleWeeklyHour extends BaseEntity {
  @Enum({ items: () => Weekday, nativeEnumName: 'weekday' })
  weekday: Weekday;

  @Property({ type: 'time' })
  startTime: string; // e.g., '08:00'

  @Property({ type: 'time' })
  endTime: string; // e.g., '17:00'

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
  })
  schedule: Schedule;
}
