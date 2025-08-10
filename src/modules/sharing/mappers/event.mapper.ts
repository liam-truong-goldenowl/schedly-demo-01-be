import { plainToInstance } from 'class-transformer';

import { Event } from '@/database/entities/event.entity';

import { EventRespDto } from '../dto/event-resp.dto';

export class EventMapper {
  static toResponse(event: Event): EventRespDto {
    return plainToInstance(EventRespDto, event, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseList(events: Event[]): EventRespDto[] {
    return events.map((event) => this.toResponse(event));
  }
}
