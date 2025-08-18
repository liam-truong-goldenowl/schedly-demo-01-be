import {
  Entity,
  Property,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { MeetingInviteeRepository } from '../repositories/meeting-invitee.repository';

import { Meeting } from './meeting.entity';

@Entity({ repository: () => MeetingInviteeRepository })
export class MeetingInvitee extends BaseEntity {
  [EntityRepositoryType]?: MeetingInviteeRepository;

  @ManyToOne({ entity: () => Meeting, serializedName: 'meetingId' })
  meeting: Meeting;

  @Property({ length: 255, nullable: true })
  note?: string;

  @Property({ length: 255 })
  email: string;

  @Property({ length: 255 })
  name: string;

  @Property()
  timezone: string;
}
