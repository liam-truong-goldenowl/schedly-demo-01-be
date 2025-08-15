import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { Event, MeetingInvitee } from '@/database/entities';

@Entity()
export class Meeting extends BaseEntity {
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
