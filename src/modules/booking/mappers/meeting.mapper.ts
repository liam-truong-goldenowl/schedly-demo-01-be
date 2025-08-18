import { plainToInstance } from 'class-transformer';

import { Meeting } from '@/modules/meeting/entities/meeting.entity';

import { MeetingResDto } from '../dto/res/meeting-res.dto';

export class MeetingMapper {
  static toResponse(meeting: Meeting): MeetingResDto {
    return plainToInstance(MeetingResDto, meeting, {
      excludeExtraneousValues: true,
    });
  }
}
