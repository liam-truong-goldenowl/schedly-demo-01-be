import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@mikro-orm/nestjs';

import { WeeklyHour } from '../entities/weekly-hour.entity';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class ScheduleCreatedListener {
  constructor(
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  @OnEvent(ScheduleCreatedEvent.name)
  async handleScheduleCreatedEvent(event: ScheduleCreatedEvent) {
    await this.weeklyHourRepo.createDefaultEntities(event.payload.id);
  }
}
