import {
  Entity,
  Property,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';

import { DateOverrideRepository } from '../repositories/date-override.repository';

import { Schedule } from './schedule.entity';

@Entity({ repository: () => DateOverrideRepository })
export class DateOverride extends BaseEntity {
  [EntityRepositoryType]? = DateOverrideRepository;

  @Property({ type: 'date' })
  date: string;

  @Property({ type: 'time', nullable: true })
  startTime?: string;

  @Property({ type: 'time', nullable: true })
  endTime?: string;

  @ManyToOne({
    entity: () => Schedule,
    serializedName: 'scheduleId',
    deleteRule: 'cascade',
  })
  schedule: Schedule;
}
