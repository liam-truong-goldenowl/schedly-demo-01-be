import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';

import { CursorBasedResDto } from '@/common/dto';

import { EventResDto } from './event-res.dto';

export class ListEventResDto extends CursorBasedResDto {
  @Expose()
  @Type(() => EventResDto)
  @ApiProperty({
    type: [EventResDto],
    description: 'List of events',
  })
  items: EventResDto[];
}
