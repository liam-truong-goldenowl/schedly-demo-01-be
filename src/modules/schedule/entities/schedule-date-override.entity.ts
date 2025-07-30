import { Entity, Cascade, Property, ManyToOne } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { Schedule } from './schedule.entity';

@Entity()
export class ScheduleDateOverride extends BaseEntity {
  @Property({ type: 'date' })
  date: Date;

  @Property({ type: 'time' })
  startTime: string;

  @Property({ type: 'time' })
  endTime: string;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
    cascade: [Cascade.REMOVE],
  })
  schedule: Schedule;
}
