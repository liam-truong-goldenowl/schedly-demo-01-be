import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { Event } from '@/modules/event/entities/event.entity';

import { MeetingRepository } from '../repositories/meeting.repository';

import { MeetingInvitee } from './meeting-invitee.entity';

@Entity({ repository: () => MeetingRepository })
export class Meeting extends BaseEntity {
  [EntityRepositoryType]?: MeetingRepository;

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

  @OneToMany({
    entity: () => MeetingInvitee,
    mappedBy: (invitee) => invitee.meeting,
    orphanRemoval: true,
  })
  invitees = new Collection<MeetingInvitee>(this);
}
