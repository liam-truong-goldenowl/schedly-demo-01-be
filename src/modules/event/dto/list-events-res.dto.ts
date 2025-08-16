import { createCursorPaginationResDto } from '@/common/dtos';

import { EventResDto } from './event-res.dto';

export class ListEventsResDto extends createCursorPaginationResDto(
  EventResDto,
) {}
