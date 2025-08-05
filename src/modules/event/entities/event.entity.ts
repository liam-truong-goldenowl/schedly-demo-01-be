import { Opt, Enum, Check, Entity, Property, ManyToOne } from '@mikro-orm/core';

import { EventType, LocationType } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';

@Entity()
@Check<Event>({ expression: (columns) => `${columns.duration} > 0` })
export class Event extends BaseEntity {
  @Property({ length: 255 })
  name: string;

  @Property({ nullable: true })
  description?: string & Opt;

  @Property()
  duration: number; // Duration in minutes

  @Enum({
    items: () => EventType,
    nativeEnumName: 'event_type',
  })
  type: EventType;

  @Enum({
    items: () => LocationType,
    nativeEnumName: 'location_type',
  })
  locationType: LocationType;

  @Property()
  locationDetails: string;

  @Property({ default: 1 })
  inviteeLimit: number & Opt = 1;

  @ManyToOne({
    entity: () => User,
    serializedName: 'userId',
  })
  user: User;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
  })
  schedule: Schedule;
}
