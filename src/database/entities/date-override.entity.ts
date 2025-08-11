import { Entity, Property, ManyToOne } from '@mikro-orm/postgresql';

import { BaseEntity } from '@/common/entities/base.entity';

import { Schedule } from './schedule.entity';

@Entity()
export class DateOverride extends BaseEntity {
  @Property({ type: 'date' })
  date: Date;

  @Property({ type: 'time', nullable: true })
  startTime?: string;

  @Property({ type: 'time', nullable: true })
  endTime?: string;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
    deleteRule: 'cascade',
  })
  schedule: Schedule;
}
