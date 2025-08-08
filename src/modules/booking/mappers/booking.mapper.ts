import { plainToInstance } from 'class-transformer';

import { Meeting } from '../entities/meeting.entity';
import { BookingRespDto } from '../dto/booking-resp.dto';

export class BookingMapper {
  static toResponse(meeting: Meeting): BookingRespDto {
    return plainToInstance(BookingRespDto, meeting, {
      excludeExtraneousValues: true,
    });
  }
}
