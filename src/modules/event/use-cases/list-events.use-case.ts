import { Injectable } from '@nestjs/common';

import { EventMapper } from '../mappers/event.mapper';
import { EventRepository } from '../repositories/event.repository';
import { ListEventsQueryDto } from '../dto/req/list-events-query.dto';

@Injectable()
export class ListEventsUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute(userId: number, { cursor, limit }: ListEventsQueryDto) {
    const currentCursor = await this.eventRepo.findByCursor(
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
