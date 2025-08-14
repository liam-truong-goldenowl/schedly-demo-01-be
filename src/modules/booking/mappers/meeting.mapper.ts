import { plainToInstance } from 'class-transformer';

import { Meeting } from '@/database/entities';

import { MeetingResDto } from '../dto';

export class MeetingMapper {
  static toResponse(meeting: Meeting): MeetingResDto {
    return plainToInstance(MeetingResDto, meeting, {
      excludeExtraneousValues: true,
    });
  }
}
