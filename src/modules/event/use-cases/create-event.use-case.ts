import { Injectable } from '@nestjs/common';

import { EventMapper } from '../mappers/event.mapper';
import { CreateEventDto } from '../dto/req/create-event.dto';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class CreateEventUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute(userId: number, data: CreateEventDto) {
    const event = await this.eventRepo.createEntity({
      ...data,
      user: userId,
      schedule: data.scheduleId,
    });
    return EventMapper.toResponse(event);
  }
}
