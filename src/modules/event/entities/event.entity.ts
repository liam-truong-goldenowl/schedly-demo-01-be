import {
  Opt,
  Enum,
  Check,
  Entity,
  Unique,
  Property,
  ManyToOne,
  BeforeCreate,
} from '@mikro-orm/core';

import { EventType, LocationType } from '@/common/enums';
import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { SlugHelper } from '@/common/utils/helpers/slug.helper';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';

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
  duration: number;

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
    deleteRule: 'cascade',
  })
  user: User;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
    deleteRule: 'cascade',
  })
  schedule: Schedule;

  @BeforeCreate()
  async generateSlug() {
    this.slug = await SlugHelper.generateUnique(this.name);
  }
}
