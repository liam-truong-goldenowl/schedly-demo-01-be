import { MeetingResDto } from '@/modules/booking/dto';
import { createCursorPaginationResDto } from '@/common/dtos';

export class ListMeetingsResDto extends createCursorPaginationResDto(
  MeetingResDto,
) {}
