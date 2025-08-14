import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Event } from '@/database/entities';

import { EventMapper } from '../mappers';

@Injectable()
export class ListEventsUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    userId,
    cursor,
    limit,
  }: {
    userId: number;
    cursor?: string;
    limit: number;
  }) {
    const currentCursor = await this.em.findByCursor(
      Event,
      { user: userId },
      {
        first: limit,
        after: cursor,
        orderBy: { createdAt: 'DESC' },
        populate: ['schedule'],
      },
    );

    return EventMapper.toCursorPaginatedResponse(currentCursor);
  }
}
