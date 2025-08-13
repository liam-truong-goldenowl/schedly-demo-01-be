import { difference } from 'es-toolkit';
import { EntityManager } from '@mikro-orm/core';
import { Body, Injectable } from '@nestjs/common';

import { Meeting, WeeklyHour, DateOverride } from '@/database/entities';
import {
  getOffsetTime,
  formatDateString,
  formatTimeString,
  generateTimeSlots,
  getDatesByWeekday,
  getEndDateOfMonth,
  getAllDatesOfAMonth,
  getStartDateOfMonth,
  transformTimeZoneDates,
} from '@/utils/helpers/time';

import { BookingService } from '../booking.service';

interface ListTimeSlotsUseCaseBody {
  eventId: number;
  month: string;
  timezone: string;
}

@Injectable()
export class ListTimeSlotsUseCase {
  constructor(
    private em: EntityManager,
    private bookingService: BookingService,
  ) {}

  async execute(body: ListTimeSlotsUseCaseBody) {
    const { eventId, month, timezone } = body;
    const targetEvent = await this.bookingService.findEventOrThrow(eventId);
    const baseTz = targetEvent.schedule.timezone;
    const otherTz = body.timezone;
    const { duration } = targetEvent;

    const startOfMonth = getStartDateOfMonth(month, timezone);
    const endOfMonth = getEndDateOfMonth(month, timezone);

    const [weeklyHours, dateOverrides] = await Promise.all([
      this.em.find(WeeklyHour, { schedule: { id: targetEvent.schedule.id } }),
      this.em.find(DateOverride, {
        schedule: { id: targetEvent.schedule.id },
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }),
    ]);

    const overriddenDates = dateOverrides
      .map(({ date, startTime, endTime }) => {
        const isAvailable = startTime && endTime;
        return isAvailable
          ? {
              date: formatDateString(date),
              startTime: startTime,
              endTime: endTime,
            }
          : null;
      })
      .filter((d) => d != null);
    const overriddenDatesMap = new Map<
      string,
      { date: string; startTime: string; endTime: string }[]
    >();

    overriddenDates.forEach((rd) => {
      if (overriddenDatesMap.has(rd.date)) {
        overriddenDatesMap.get(rd.date)!.push(rd);
      } else {
        overriddenDatesMap.set(rd.date, [rd]);
      }
    });

    const weeklyHourDates = weeklyHours.flatMap(
      ({ weekday, startTime, endTime }) => {
        const dates = getDatesByWeekday(body.month, weekday, body.timezone);
        return dates.map((date) => ({ date, startTime, endTime }));
      },
    );
    const weeklyHourDatesMap = new Map<
      string,
      { date: string; startTime: string; endTime: string }[]
    >();

    weeklyHourDates.forEach((wh) => {
      if (weeklyHourDatesMap.has(wh.date)) {
        weeklyHourDatesMap.get(wh.date)!.push(wh);
      } else {
        weeklyHourDatesMap.set(wh.date, [wh]);
      }
    });

    const timeSlotsMap = new Map<string, string[]>();
    const allDatesInMonth = getAllDatesOfAMonth(month, timezone);

    allDatesInMonth.forEach((date) => {
      if (!timeSlotsMap.has(date)) {
        timeSlotsMap.set(date, []);
      }

      const overridden = overriddenDatesMap.get(date);
      const weeklyHour = weeklyHourDatesMap.get(date);

      const currentDateItems = overridden || weeklyHour;

      if (!currentDateItems) {
        timeSlotsMap.set(date, []);
        return;
      }

      const zonedDates = currentDateItems.flatMap((item) =>
        transformTimeZoneDates({ baseTz, otherTz, ...item }),
      );
      const timeSlots = zonedDates.map(({ date, startTime, endTime }) => ({
        date,
        slots: generateTimeSlots({ startTime, endTime, duration }),
      }));

      timeSlots.forEach((timeSlot) => {
        if (timeSlotsMap.has(timeSlot.date)) {
          timeSlotsMap.get(timeSlot.date)!.push(...timeSlot.slots);
        } else {
          timeSlotsMap.set(timeSlot.date, timeSlot.slots);
        }
      });
    });

    const unavailableDates = dateOverrides
      .map(({ date, ...rest }) => ({ ...rest, date: formatDateString(date) }))
      .filter(({ startTime, endTime }) => !startTime && !endTime)
      .flatMap(({ date }) =>
        transformTimeZoneDates({
          baseTz,
          otherTz,
          date,
          startTime: '00:00',
          endTime: '23:59',
        }),
      );
    unavailableDates.forEach(({ date, startTime, endTime }) => {
      const slots = timeSlotsMap.get(date);
      if (slots) {
        const newSlots = slots.filter(
          (slot) => slot < startTime || slot > endTime,
        );
        timeSlotsMap.set(date, newSlots);
      }
    });

    const meetings = await this.em.findAll(Meeting, {
      where: {
        event: { id: targetEvent.id },
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
      },
      fields: ['startDate', 'startTime', 'timezone'],
    });

    const remainingInviteesMap = new Map<string, number>();

    meetings.forEach((meeting) => {
      const date = formatDateString(meeting.startDate);
      const time = formatTimeString(meeting.startTime);
      const key = `${date}T${time}`;

      if (remainingInviteesMap.has(key)) {
        const invitees = remainingInviteesMap.get(key)!;
        remainingInviteesMap.set(key, invitees - 1);
      } else {
        remainingInviteesMap.set(key, targetEvent.inviteeLimit - 1);
      }
    });

    const alreadyBookedSlots = meetings
      .map(({ startDate, startTime, ...rest }) => ({
        date: formatDateString(startDate),
        time: formatTimeString(startTime),
        ...rest,
      }))
      .flatMap(({ date, time }) => ({
        date,
        startTime: getOffsetTime({ time, baseTz, otherTz }),
      }));

    alreadyBookedSlots.forEach(({ date, startTime: time }) => {
      const remainingInviteesKey = `${date}T${time}`;
      const remainingInvitees =
        remainingInviteesMap.get(remainingInviteesKey) ?? 1;
      const slots = timeSlotsMap.get(date);

      if (slots && remainingInvitees < 1) {
        timeSlotsMap.set(date, difference(slots, [time]));
      }
    });

    const timeSlots = Array.from(timeSlotsMap.entries()).map(
      ([date, slots]) => ({ date, slots }),
    );

    return timeSlots;
  }
}
