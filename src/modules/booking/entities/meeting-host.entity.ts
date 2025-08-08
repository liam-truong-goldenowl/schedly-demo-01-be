import { Entity, Unique, ManyToOne } from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

import { Meeting } from './meeting.entity';

@Entity()
@Unique({ properties: ['meeting', 'host'] })
export class MeetingHost extends BaseEntity {
  @ManyToOne({ entity: () => Meeting, serializedName: 'meetingId' })
  meeting: Meeting;

  @ManyToOne({ entity: () => User, serializedName: 'hostId' })
  host: User;
}
