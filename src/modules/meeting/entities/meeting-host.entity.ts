import {
  Entity,
  Unique,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

import { MeetingHostRepository } from '../repositories/meeting-host.repository';

import { Meeting } from './meeting.entity';

@Entity({ repository: () => MeetingHostRepository })
@Unique({ properties: ['meeting', 'host'] })
export class MeetingHost extends BaseEntity {
  [EntityRepositoryType]?: MeetingHostRepository;

  @ManyToOne({ entity: () => Meeting, serializedName: 'meetingId' })
  meeting: Meeting;

  @ManyToOne({ entity: () => User, serializedName: 'hostId' })
  host: User;
}
