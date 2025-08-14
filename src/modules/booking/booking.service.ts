import { EntityManager } from '@mikro-orm/core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Schedule } from '@/database/entities/schedule.entity';
import { Event, Meeting, WeeklyHour, DateOverride } from '@/database/entities';
import {
  getWeekday,
  getZonedTime,
  addMinutesToTime,
  generateValidTimeStartTimes,
} from '@/utils/helpers/time';

@Injectable()
export class BookingService {
  constructor(private em: EntityManager) {}

  async findEventOrThrow(eventId: number) {
    const event = await this.em.findOne(Event, { id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

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

    if (!validStartTimes.includes(startTime)) {
      throw new BadRequestException(`Invalid start time: ${startTime}`);
    }
  }

  async validateEventLimit({
    eventId,
    startTime,
    startDate,
  }: {
    eventId: number;
    startTime: string;
    startDate: string;
  }) {
    const event = await this.em.findOneOrFail(
      Event,
      { id: eventId },
      { fields: ['id', 'inviteeLimit'] },
    );
    const currentParticipants = await this.em.count(Meeting, {
      event: { id: eventId },
      startTime,
      startDate,
    });

    console.log(currentParticipants);
    // console.log(event);

    if (currentParticipants >= event.inviteeLimit) {
      throw new BadRequestException(
        `Event invitee limit reached: ${event.inviteeLimit}`,
      );
    }
  }
}
