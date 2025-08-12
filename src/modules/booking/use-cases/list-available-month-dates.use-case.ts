import { difference } from 'es-toolkit/array';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event, WeeklyHour, DateOverride } from '@/database/entities';
import {
  getDatesByWeekday,
  getEndDateOfMonth,
  getStartDateOfMonth,
} from '@/utils/helpers/time';

@Injectable()
export class ListAvailableMonthDatesUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    eventId,
    monthString,
    timezone,
  }: {
    eventId: number;
    monthString: string;
    timezone: string;
  }) {
    const targetEvent = await this.em.findOne(
      Event,
      { id: eventId },
      { fields: ['id', 'duration', 'schedule'] },
    );

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    const startOfMonth = getStartDateOfMonth(monthString, timezone);
    const endOfMonth = getEndDateOfMonth(monthString, timezone);
    const dateOverrides = await this.em.find(
      DateOverride,
      {
        schedule: { id: targetEvent.schedule.id },
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
      {
        fields: ['date', 'startTime', 'endTime'],
      },
    );
    const weeklyHours = await this.em.find(
      WeeklyHour,
      {
        schedule: { id: targetEvent.schedule.id },
      },
      { fields: ['weekday'] },
    );

    const weekdays = Array.from(new Set(weeklyHours.map((wh) => wh.weekday)));
    const availableDates = [
      weekdays.flatMap((weekday) =>
        getDatesByWeekday(monthString, weekday, timezone),
      ),
      dateOverrides.map(
        (override) => override.date.toISOString().split('T')[0],
      ),
    ].flat();
    const unavailableDates = dateOverrides
      .filter(
        (override) => override.startTime == null && override.endTime == null,
      )
      .map((override) => override.date.toISOString().split('T')[0]);

    return difference(availableDates, unavailableDates).toSorted();
  }
}
