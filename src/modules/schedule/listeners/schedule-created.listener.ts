import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityManager } from '@mikro-orm/postgresql';

import { Weekday } from '@/common/enums';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleWeeklyHour } from '../entities/schedule-weekly-hour.entity';

@Injectable()
export class ScheduleCreatedListener {
  constructor(private em: EntityManager) {}

  @OnEvent('schedule.created')
  async handleScheduleCreatedEvent(event: ScheduleCreatedEvent) {
    // new weekly hours for mon to fri
    const defaultStart = '09:00';
    const defaultEnd = '17:00';

    const commonProperties = {
      endTime: defaultEnd,
      startTime: defaultStart,
      schedule: this.em.getReference(Schedule, event.schedule.id),
    };

    const defaultWeekdays = [
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
    ];

    const weeklyHours = defaultWeekdays.map((weekday) =>
      this.em.create(ScheduleWeeklyHour, {
        ...commonProperties,
        weekday: weekday,
      }),
    );

    await this.em.persistAndFlush(weeklyHours);
  }
}
