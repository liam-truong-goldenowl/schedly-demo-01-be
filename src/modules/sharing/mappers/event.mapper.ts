import { plainToInstance } from 'class-transformer';

import { Event } from '@/modules/event/entities/event.entity';

import { SharingEventResDto } from '../dto/res/sharing-event-res.dto';

export class EventMapper {
  static toResponse(event: Event): SharingEventResDto {
    return plainToInstance(SharingEventResDto, event, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseList(events: Event[]): SharingEventResDto[] {
    return events.map((event) => this.toResponse(event));
  }
}
