import { Cursor } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';

import { Event } from '@/database/entities';

import { EventResDto, ListEventResDto } from '../dto';

export class EventMapper {
  static toResponse(event: Event): EventResDto {
    return plainToInstance(EventResDto, event, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseList(events: Event[]): EventResDto[] {
    return events.map((event) => this.toResponse(event));
  }

  static toCursorPaginatedResponse(cursor: Cursor<Event>): ListEventResDto {
    const { items, endCursor: nextCursor, hasNextPage, totalCount } = cursor;

    return plainToInstance(
      ListEventResDto,
      {
        items: items.map((item) => this.toResponse(item)),
        nextCursor,
        hasNextPage,
        totalCount,
      },
      { excludeExtraneousValues: true },
    );
  }
}
