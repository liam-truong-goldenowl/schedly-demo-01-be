import { EntityManager } from '@mikro-orm/core';
import { Injectable, BadRequestException } from '@nestjs/common';

import { Schedule } from '@/database/entities/schedule.entity';
import { Event, WeeklyHour, DateOverride } from '@/database/entities';
import {
  getWeekday,
  getZonedTime,
  addMinutesToTime,
  generateValidTimeStartTimes,
} from '@/utils/helpers/time';

@Injectable()
export class BookingService {
  constructor(private em: EntityManager) {}

  async validateEventStartTime({
    eventId,
    scheduleId,
    startTime,
    startDate,
    timezone,
  }: {
    eventId: number;
    scheduleId: number;
    startTime: string;
    startDate: string;
    timezone: string;
  }) {
    const targetSchedule = await this.em.findOneOrFail(
      Schedule,
      { id: scheduleId },
      {
        fields: ['timezone'],
      },
    );
    const targetEvent = await this.em.findOneOrFail(
      Event,
      { id: eventId },
      { fields: ['duration'] },
    );

    const inviteeZoneStartTime = getZonedTime(startTime, timezone);
    const meetingEndTime = addMinutesToTime({
      timeString: inviteeZoneStartTime,
      minutes: targetEvent.duration,
      timezone: targetSchedule.timezone,
    });
    const weekday = getWeekday(startDate, timezone);

    const weeklyHours = await this.em.find(
      WeeklyHour,
      {
        schedule: { id: scheduleId },
        weekday,
        endTime: { $gte: meetingEndTime },
      },
      {
        fields: ['startTime', 'endTime', 'weekday'],
      },
    );
    const dateOverrides = await this.em.find(
      DateOverride,
      {
        schedule: { id: scheduleId },
        date: startDate,
        endTime: { $ne: null, $gte: meetingEndTime },
      },
      {
        fields: ['startTime', 'endTime', 'date'],
      },
    );

    const validStartTimes =
      dateOverrides.length > 0
        ? weeklyHours.flatMap((hour) =>
            generateValidTimeStartTimes({
              startTime: hour.startTime,
              endTime: hour.endTime,
              duration: targetEvent.duration,
              timezone,
            }),
          )
        : dateOverrides
            .filter((override) => override.startTime && override.endTime)
            .flatMap((override) =>
              generateValidTimeStartTimes({
                startTime: override.startTime!,
                endTime: override.endTime!,
                duration: targetEvent.duration,
                timezone,
              }),
            );

    if (!validStartTimes.includes(startTime)) {
      throw new BadRequestException(`Invalid start time: ${startTime}`);
    }
  }
}
