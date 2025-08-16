import {
  Entity,
  Unique,
  Property,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { MeetingGuestRepository } from '../repositories/meeting-guest.repository';

import { Meeting } from './meeting.entity';

@Entity({ repository: () => MeetingGuestRepository })
@Unique({ properties: ['meeting', 'email'] })
export class MeetingGuest extends BaseEntity {
  [EntityRepositoryType]?: MeetingGuestRepository;

  @ManyToOne({ entity: () => Meeting, serializedName: 'meetingId' })
  meeting: Meeting;

  @Property({ length: 255 })
  email: string;
}
