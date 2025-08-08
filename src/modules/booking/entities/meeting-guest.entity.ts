import { Entity, Unique, Cascade, Property, ManyToOne } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { Meeting } from './meeting.entity';

@Entity()
@Unique({ properties: ['meeting', 'email'] })
export class MeetingGuest extends BaseEntity {
  @ManyToOne({
    entity: () => Meeting,
    serializedName: 'meetingId',
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  meeting: Meeting;

  @Property({ length: 255 })
  email: string;
}
