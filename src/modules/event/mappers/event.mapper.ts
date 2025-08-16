import { Cursor } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';

import { Event } from '../entities/event.entity';
import { EventResDto } from '../dto/res/event-res.dto';
import { ListEventsResDto } from '../dto/res/list-events-res.dto';
import { ReadEventDetailsResDto } from '../dto/res/read-event-details-res.dto';

export class EventMapper {
  static toResponse(entity: Event): EventResDto {
    return plainToInstance(
      EventResDto,
      { ...entity, scheduleId: entity.schedule.id },
      { excludeExtraneousValues: true },
    );
  }

  static toResponseList(entities: Event[]): EventResDto[] {
    return entities.map((event) => this.toResponse(event));
  }

  static toCursorPaginatedResponse(cursor: Cursor<Event>): ListEventsResDto {
    const { items, endCursor: nextCursor, hasNextPage, totalCount } = cursor;

    return plainToInstance(
      ListEventsResDto,
      {
        items: items.map((item) => this.toResponse(item)),
        nextCursor,
        hasNextPage,
        totalCount,
      },
      { excludeExtraneousValues: true },
    );
  }

  static toDetailsResponse(entity: Event): ReadEventDetailsResDto {
    return plainToInstance(
      ReadEventDetailsResDto,
      {
        ...entity,
        host: {
          name: entity.user.name,
        },
        location: {
          type: entity.locationType,
          details: entity.locationDetails,
        },
        timezone: entity.schedule.timezone,
      },
      { excludeExtraneousValues: true },
    );
  }
}
