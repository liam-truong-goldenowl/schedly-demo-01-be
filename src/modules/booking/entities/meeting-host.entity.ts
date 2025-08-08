import { Entity, Unique, Cascade, ManyToOne } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

import { Meeting } from './meeting.entity';

@Entity()
@Unique({ properties: ['meeting', 'host'] })
export class MeetingHost extends BaseEntity {
  @ManyToOne({
    entity: () => Meeting,
    serializedName: 'meetingId',
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  meeting: Meeting;

  @ManyToOne({
    entity: () => User,
    serializedName: 'hostId',
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  host: User;
}
