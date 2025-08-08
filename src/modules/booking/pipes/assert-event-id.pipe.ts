import { EntityManager, NotFoundError } from '@mikro-orm/core';
import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';

import { Event } from '@/modules/event/entities/event.entity';

@Injectable()
export class AssertEventIdPipe implements PipeTransform {
  constructor(private em: EntityManager) {}

  async transform(body: { eventId: number }): Promise<unknown> {
    try {
      await this.em.findOneOrFail(
        Event,
        { id: body.eventId },
        { fields: ['id'] },
      );

      return body;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('Event not found');
      }

      throw error;
    }
  }
}
