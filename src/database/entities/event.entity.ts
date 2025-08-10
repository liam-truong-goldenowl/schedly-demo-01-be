import {
  Opt,
  Enum,
  Check,
  Entity,
  Unique,
  Property,
  ManyToOne,
} from '@mikro-orm/core';

import { User } from '@/database/entities/user.entity';
import { EventType, LocationType } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';

import { Schedule } from './schedule.entity';

@Entity()
@Check({ expression: (columns) => `${columns.duration} > 0` })
@Unique({ properties: ['slug', 'user'] })
export class Event extends BaseEntity {
  @Property({ length: 255 })
  name: string;

  @Property({ length: 255 })
  slug: string & Opt;

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
