import { Cursor } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';

import { Event } from '@/database/entities';

import { EventResDto, ListEventResDto } from '../dto';
import { ReadEventDetailsDto } from '../dto/read-event-details.dto';

export class EventMapper {
  static toResponse(event: Event): EventResDto {
    return plainToInstance(
      EventResDto,
      {
        ...event,
        scheduleId: event.schedule.id,
      },
      {
        excludeExtraneousValues: true,
      },
    );
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

  static toDetailsResponse(event: Event): ReadEventDetailsDto {
    return plainToInstance(
      ReadEventDetailsDto,
      {
        ...event,
        host: {
          name: event.user.name,
        },
        location: {
          type: event.locationType,
          details: event.locationDetails,
        },
        timezone: event.schedule.timezone,
      },
      { excludeExtraneousValues: true },
    );
  }
}
