import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { User } from '@/modules/user/entities/user.entity';
import { Event } from '@/modules/event/entities/event.entity';
import { UseCase } from '@/common/interfaces/use-case.interface';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { EventRespDto } from '../dto/event-resp.dto';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class GetSharingEventsUseCase implements UseCase<User, EventRespDto[]> {
  constructor(private em: EntityManager) {}

  async execute(user: User): Promise<EventRespDto[]> {
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
