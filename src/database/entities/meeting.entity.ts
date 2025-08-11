import { Entity, Unique, Property, ManyToOne } from '@mikro-orm/core';

import { Event } from '@/database/entities';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity()
@Unique({ properties: ['startDate', 'startTime', 'event'] })
export class Meeting extends BaseEntity {
  @Property({ nullable: true })
  note?: string;

  @Property({ type: 'date' })
  startDate: Date;

  @Property({ type: 'time' })
  startTime: string;

  @Property()
  timezone: string;

  @ManyToOne({ entity: () => Event, serializedName: 'eventId' })
  event: Event;
}
