import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { EventMapper } from '../mappers/event.mapper';
import { EventRepository } from '../repositories/event.repository';
import { ListEventSelectResDto } from '../dto/res/list-event-select-res.dto';

@Injectable()
export class ListEventSelectUseCase {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(hostId: number): Promise<ListEventSelectResDto[]> {
    const events = await this.eventRepository.findAllByHostId(hostId);
    return EventMapper.toSelectResponse(events);
  }
}
