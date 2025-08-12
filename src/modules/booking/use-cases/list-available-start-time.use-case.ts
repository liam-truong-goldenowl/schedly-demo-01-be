import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event, WeeklyHour, DateOverride } from '@/database/entities';
import { getWeekday, generateValidTimeStartTimes } from '@/utils/helpers/time';

@Injectable()
export class ListAvailableStartTimeUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    eventId,
    dateString,
    timezone,
  }: {
    eventId: number;
    dateString: string;
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

    const weekday = getWeekday(dateString, timezone);

    const weeklyHours = await this.em.find(
      WeeklyHour,
      {
        schedule: { id: targetEvent.schedule.id },
        weekday,
      },
      {
        fields: ['startTime', 'endTime', 'weekday'],
      },
    );
    const dateOverrides = await this.em.find(
      DateOverride,
      {
        schedule: { id: targetEvent.schedule.id },
        date: dateString,
      },
      {
        fields: ['startTime', 'endTime'],
      },
    );

    const validStartTimes =
      dateOverrides.length > 0
        ? dateOverrides
            .filter((override) => override.startTime && override.endTime)
            .flatMap((override) =>
              generateValidTimeStartTimes({
                startTime: override.startTime!,
                endTime: override.endTime!,
                duration: targetEvent.duration,
                timezone,
              }),
            )
        : weeklyHours.flatMap((hour) =>
            generateValidTimeStartTimes({
              startTime: hour.startTime,
              endTime: hour.endTime,
              duration: targetEvent.duration,
              timezone,
            }),
          );

    return validStartTimes;
  }
}
