import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { User, Event, Schedule } from '@/database/entities';

import { EventMapper } from '../mappers';
import { SharingEventResDto } from '../dto';

@Injectable()
export class GetSharingEventsUseCase {
  constructor(private em: EntityManager) {}

  async execute(user: User): Promise<SharingEventResDto[]> {
    const schedules = await this.em.findAll(Schedule, {
      fields: ['id'],
      filters: { ownBy: { id: user.id } },
    });
    const scheduleIds = schedules.map((schedule) => schedule.id);

    const events = await this.em.find(Event, {
      schedule: { id: { $in: scheduleIds } },
    });

    return EventMapper.toResponseList(events);
  }
}
