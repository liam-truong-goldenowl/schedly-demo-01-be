import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class ScheduleCreatedListener {
  constructor(private readonly weeklyHourRepo: WeeklyHourRepository) {}

  @OnEvent('schedule.created')
  async handleScheduleCreatedEvent(event: ScheduleCreatedEvent) {
    await this.weeklyHourRepo.createDefaultEntities(event.payload.id);
  }
}
