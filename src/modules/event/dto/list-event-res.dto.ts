import { ApiProperty } from '@nestjs/swagger';
import { Cursor } from '@mikro-orm/postgresql';
import { Type, Expose, plainToInstance } from 'class-transformer';

import { CursorBasedResDto } from '@/common/dto/cursor-based-res.dto';

import { Event } from '../entities/event.entity';

import { EventResDto } from './event-res.dto';

export class ListEventResDto extends CursorBasedResDto {
  @Expose()
  @Type(() => EventResDto)
  @ApiProperty({
    type: [EventResDto],
    description: 'List of events',
  })
  items: EventResDto[];

  static fromCursor(cursor: Cursor<Event>): ListEventResDto {
    const { items, endCursor: nextCursor, hasNextPage, totalCount } = cursor;

    return plainToInstance(
      ListEventResDto,
      { items, nextCursor, hasNextPage, totalCount },
      { excludeExtraneousValues: true },
    );
  }
}
