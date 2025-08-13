import { difference } from 'es-toolkit';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Event, Meeting, WeeklyHour, DateOverride } from '@/database/entities';
import {
  getOffsetTime,
  convertTimeZone,
  formatDateString,
  formatTimeString,
  generateTimeSlots,
  getDatesByWeekday,
  getEndDateOfMonth,
  getAllDatesOfAMonth,
  getStartDateOfMonth,
} from '@/utils/helpers/time';

@Injectable()
export class ListTimeSlotsUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    eventId,
    month,
    timezone,
  }: {
    eventId: number;
    month: string;
    timezone: string;
  }) {
    const targetEvent = await this.em.findOne(
      Event,
      { id: eventId },
      { fields: ['id', 'duration', 'schedule', 'inviteeLimit'] },
    );

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    const startOfMonth = getStartDateOfMonth(month, timezone);
    const endOfMonth = getEndDateOfMonth(month, timezone);

    const weeklyHours = await this.em.find(
      WeeklyHour,
      {
        schedule: { id: targetEvent.schedule.id },
      },
      { fields: ['weekday', 'startTime', 'endTime'] },
    );
    const weeklyHourDates = weeklyHours.flatMap((wh) => {
      const dates = getDatesByWeekday(month, wh.weekday, timezone);
      return dates.map((date) => ({
        date,
        startTime: wh.startTime,
        endTime: wh.endTime,
      }));
    });

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
    const unavailableDates = dateOverrides
      .filter((override) => !override.startTime && !override.endTime)
      .flatMap((override) => {
        const dateString = formatDateString(override.date);

        const result = convertTimeZone({
          baseTz: targetEvent.schedule.timezone,
          otherTz: timezone,
          dateString: dateString,
          startTimeString: '00:00',
          endTimeString: '23:59',
        });

        return result.map((slot) => ({
          date: slot.date,
          startTime: slot.startTimeString,
          endTime: slot.endTimeString,
        }));
      });
    const overriddenDates = dateOverrides
      .filter((override) => override.startTime && override.endTime)
      .map((override) => ({
        date: formatDateString(override.date),
        startTime: override.startTime!,
        endTime: override.endTime!,
      }));

    const weeklyHourDatesMap = new Map<
      string,
      { date: string; startTime: string; endTime: string }[]
    >();
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

    weeklyHourDates.forEach((wh) => {
      if (weeklyHourDatesMap.has(wh.date)) {
        weeklyHourDatesMap.get(wh.date)!.push(wh);
      } else {
        weeklyHourDatesMap.set(wh.date, [wh]);
      }
    });

    const allDatesInMonth = getAllDatesOfAMonth(month, timezone);

    const timeSlotsMap = new Map<string, string[]>();

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

      const result = currentDateItems.flatMap((item) =>
        convertTimeZone({
          baseTz: targetEvent.schedule.timezone,
          otherTz: timezone,
          dateString: item.date,
          startTimeString: item.startTime,
          endTimeString: item.endTime,
        }),
      );

      const slots = result.map((slot) => ({
        date: slot.date,
        slots: generateTimeSlots({
          startTime: slot.startTimeString,
          endTime: slot.endTimeString,
          duration: targetEvent.duration,
        }),
      }));

      slots.forEach((slot) => {
        if (timeSlotsMap.has(slot.date)) {
          timeSlotsMap.get(slot.date)!.push(...slot.slots);
        } else {
          timeSlotsMap.set(slot.date, slot.slots);
        }
      });
    });

    unavailableDates.forEach((date) => {
      const currentSlot = timeSlotsMap.get(date.date);

      if (currentSlot) {
        const newSlots = currentSlot.filter(
          (slot) => slot < date.startTime || slot > date.endTime,
        );
        timeSlotsMap.set(date.date, newSlots);
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
    const alreadyBookedSlots = meetings.flatMap((meeting) => {
      const zonedTime = getOffsetTime({
        timeString: meeting.startTime,
        baseTz: targetEvent.schedule.timezone,
        otherTz: timezone,
      });
      const date = formatDateString(meeting.startDate);
      return {
        date,
        startTime: zonedTime,
      };
    });

    alreadyBookedSlots.forEach((bookedSlot) => {
      const bookedTime = bookedSlot.startTime;
      const bookedDate = bookedSlot.date;
      const time = formatTimeString(bookedTime);
      const remainingInviteesKey = `${bookedDate}T${time}`;

      const remainingInvitees =
        remainingInviteesMap.get(remainingInviteesKey) ?? 1;
      const currentSlot = timeSlotsMap.get(bookedSlot.date);

      if (currentSlot && remainingInvitees < 1) {
        timeSlotsMap.set(bookedSlot.date, difference(currentSlot, [time]));
      }
    });

    const timeSlots = Array.from(timeSlotsMap.entries()).map(
      ([date, slots]) => ({
        date,
        slots,
      }),
    );

    return timeSlots;
  }
}
