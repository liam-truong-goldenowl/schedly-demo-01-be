import { MeetingResDto } from '@/modules/booking/dto';
import { createCursorBasedResDto } from '@/common/dto';

export class ListMeetingResDto extends createCursorBasedResDto(MeetingResDto) {}
