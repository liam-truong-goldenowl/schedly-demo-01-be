import { Entity, Unique, Property, ManyToOne } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { Meeting } from './meeting.entity';

@Entity()
@Unique({ properties: ['meeting', 'email'] })
export class MeetingGuest extends BaseEntity {
  @ManyToOne({ entity: () => Meeting, serializedName: 'meetingId' })
  meeting: Meeting;

  @Property({ length: 255 })
  email: string;
}
