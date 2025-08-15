import { MeetingResDto } from '@/modules/booking/dto';
import { createCursorBasedResDto } from '@/common/dto';

export class ListMeetingsResDto extends createCursorBasedResDto(
  MeetingResDto,
) {}
