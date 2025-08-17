import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';
import { ScheduleRepository } from '@/modules/schedule/repositories/schedule.repository';

import { Event } from '../entities/event.entity';
import { EventMapper } from '../mappers/event.mapper';
import { CreateEventDto } from '../dto/req/create-event.dto';
import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: EventRepository,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
  ) {}

  async execute(userId: number, data: CreateEventDto) {
    const schedule = await this.scheduleRepo.findOneOrThrow({
      id: data.scheduleId,
      user: userId,
    });
    const event = await this.eventRepo.createEntity({
      ...data,
      user: userId,
      schedule,
    });
    return EventMapper.toResponse(event);
  }
}
