import { Injectable } from '@nestjs/common';

import { EventMapper } from '../mappers/event.mapper';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class ReadEventDetailsUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute(slug: string) {
    const event = await this.eventRepo.findOneOrThrow(
      { slug },
      { populate: ['user', 'schedule'] },
    );
    return EventMapper.toDetailsResponse(event);
  }
}
