import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Event } from '@/database/entities';

import { CreateEventDto } from '../dto';
import { EventMapper } from '../mappers';
import { EventService } from '../event.service';

@Injectable()
export class CreateEventUseCase {
  constructor(
    private em: EntityManager,
    private eventService: EventService,
  ) {}

  async execute(data: CreateEventDto & { userId: number }) {
    const slug = await this.eventService.generateUniqueSlugForUser({
      name: data.name,
      userId: data.userId,
    });

    const event = this.em.create(Event, {
      slug,
      user: data.userId,
      schedule: data.scheduleId,
      ...data,
    });

    await this.em.flush();

    return EventMapper.toResponse(event);
  }
}
