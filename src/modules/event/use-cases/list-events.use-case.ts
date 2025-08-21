import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Event } from '../entities/event.entity';
import { EventMapper } from '../mappers/event.mapper';
import { EventRepository } from '../repositories/event.repository';
import { ListEventsQueryDto } from '../dto/req/list-events-query.dto';

@Injectable()
export class ListEventsUseCase {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: EventRepository,
  ) {}

  async execute(userId: number, { cursor, limit, search }: ListEventsQueryDto) {
    const filters = { user: userId };

    if (search) {
      filters['name'] = new RegExp(search, 'i');
    }

    const currentCursor = await this.eventRepo.findByCursor(filters, {
      first: limit,
      after: cursor,
      orderBy: { createdAt: 'DESC' },
      populate: ['schedule'],
    });
    return EventMapper.toCursorPaginatedResponse(currentCursor);
  }
}
