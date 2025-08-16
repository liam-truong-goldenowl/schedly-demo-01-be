import { createCursorPaginationResDto } from '@/common/dto/cursor-pagination-res.dto';

import { EventResDto } from './event-res.dto';

export class ListEventsResDto extends createCursorPaginationResDto(
  EventResDto,
) {}
