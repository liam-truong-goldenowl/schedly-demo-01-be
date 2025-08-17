import {
  Opt,
  Check,
  Entity,
  Unique,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  BeforeCreate,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { SlugHelper } from '@/common/utils/helpers/slug.helper';
import { Meeting } from '@/modules/meeting/entities/meeting.entity';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { EventRepository } from '../repositories/event.repository';

@Entity({ repository: () => EventRepository })
@Check({ expression: (columns) => `${columns.duration} > 0` })
@Unique({ properties: ['slug', 'user'] })
export class Event extends BaseEntity {
  [EntityRepositoryType]?: EventRepository;

  @Property({ length: 255 })
  name: string;

  @Property({ length: 255 })
  slug: string & Opt;

  @Property({ nullable: true })
  description?: string & Opt;

  @Property()
  duration: number;

  @Property({ default: 1 })
  inviteeLimit: number = 1;

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

  @OneToMany({
    entity: () => Meeting,
    mappedBy: (meeting) => meeting.event,
    orphanRemoval: true,
  })
  meetings = new Collection<Meeting>(this);

  @BeforeCreate()
  async generateSlug() {
    this.slug = await SlugHelper.generateUnique(this.name);
  }
}
