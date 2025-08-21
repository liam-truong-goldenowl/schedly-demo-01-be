import { createCursorPaginationResDto } from '@/common/dto/cursor-pagination-res.dto';

import { MeetingResDto } from './meeting-res.dto';

export class ListMeetingsResDto extends createCursorPaginationResDto(
  MeetingResDto,
) {}
