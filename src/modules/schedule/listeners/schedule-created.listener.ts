import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';

import { Weekday } from '@/common/enums';
import { Schedule } from '@/database/entities/schedule.entity';
import { WeeklyHour } from '@/database/entities/weekly-hour.entity';

import { ScheduleCreatedEvent } from '../events/schedule-created.event';

@Injectable()
export class ScheduleCreatedListener {
  constructor(private em: EntityManager) {}

  @OnEvent(ScheduleCreatedEvent.eventName)
  async handleScheduleCreatedEvent(event: ScheduleCreatedEvent) {
    // new weekly hours for mon to fri
    const defaultStart = '09:00';
    const defaultEnd = '17:00';

    const commonProperties = {
      endTime: defaultEnd,
      startTime: defaultStart,
      schedule: this.em.getReference(Schedule, event.payload.id),
    };

    const defaultWeekdays = [
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
    ];

    const weeklyHours = defaultWeekdays.map((weekday) =>
      this.em.create(WeeklyHour, {
        ...commonProperties,
        weekday: weekday,
      }),
    );

    await this.em.persistAndFlush(weeklyHours);
  }
}
