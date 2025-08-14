import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Event } from '@/database/entities';

@Injectable()
export class DeleteEventUseCase {
  constructor(private em: EntityManager) {}

  async execute(eventId: number) {
    const event = await this.em.findOneOrFail(Event, { id: eventId });
    await this.em.removeAndFlush(event);
  }
}
