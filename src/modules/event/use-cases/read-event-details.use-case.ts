import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event } from '@/database/entities';

import { EventMapper } from '../mappers';

@Injectable()
export class ReadEventDetailsUseCase {
  constructor(private em: EntityManager) {}

  async execute(eventSlug: string) {
    const event = await this.em.findOne(
      Event,
      { slug: eventSlug },
      {
        populate: ['user', 'schedule'],
      },
    );

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return EventMapper.toDetailsResponse(event);
  }
}
