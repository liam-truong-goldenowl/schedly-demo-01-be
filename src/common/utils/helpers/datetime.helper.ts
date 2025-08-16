import { DateTime } from 'luxon';

import { Weekday } from '@/common/enums';

export class DateTimeHelper {
  static readonly DATE_FORMAT = 'yyyy-MM-dd';
  static readonly MONTH_FORMAT = 'yyyy-MM';
  static readonly TIME_FORMAT = 'HH:mm';
  static readonly TIME_FORMAT_WITH_SECONDS = 'HH:mm:ss';
  static readonly START_TIME_OF_DAY = '00:00';
  static readonly END_TIME_OF_DAY = '23:59';

  private static getTimeFormat(timeString: string): string {
    return timeString.length === 5
      ? this.TIME_FORMAT
      : this.TIME_FORMAT_WITH_SECONDS;
  }

  private static parseTimeString(timeString: string, timezone?: string) {
    const format = this.getTimeFormat(timeString);
    const dt = DateTime.fromFormat(timeString, format, { zone: timezone });
    if (!dt.isValid) {
      throw new Error(`Invalid time: ${timeString}`);
    }
    return dt;
  }

  private static parseMonthString(monthString: string, timezone?: string) {
    const dt = DateTime.fromFormat(monthString, this.MONTH_FORMAT, {
      zone: timezone,
    });
    if (!dt.isValid) {
      throw new Error(`Invalid month: ${monthString}`);
    }
    return dt;
  }

  private static parseIsoDateString(
    dateString: string,
    timezone?: string,
  ): DateTime {
    const dt = DateTime.fromISO(dateString, { zone: timezone });
    if (!dt.isValid) {
      throw new Error(`Invalid date: ${dateString}`);
    }
    return dt;
  }

  static timeRangesOverlap(
    i1: { startTime: string; endTime: string },
    i2: { startTime: string; endTime: string },
  ): boolean {
    const start1 = this.parseTimeString(i1.startTime);
    const end1 = this.parseTimeString(i1.endTime);
    const start2 = this.parseTimeString(i2.startTime);
    const end2 = this.parseTimeString(i2.endTime);
    return start1 < end2 && start2 < end1;
  }

  static getWeekdayEnum(dateStr: string, zone: string): Weekday {
    const dt = this.parseIsoDateString(dateStr, zone);
    const day = dt.weekdayLong;
    if (day && day.toUpperCase() in Weekday) {
      return Weekday[day as keyof typeof Weekday];
    }
    throw new Error(`Invalid weekday: ${day}`);
  }

  static addMinutes(timeString: string, minutes: number, timezone: string) {
    const format = this.getTimeFormat(timeString);
    const parsed = this.parseTimeString(timeString, timezone);
    return parsed.plus({ minutes }).toFormat(format);
  }

  static formatTimeInZone(timeString: string, timezone: string) {
    const format = this.getTimeFormat(timeString);
    const parsed = this.parseTimeString(timeString, timezone);
    return parsed.toFormat(format);
  }

  static generateIntervalStartTimes(
    startTime: string,
    endTime: string,
    duration: number,
    timezone: string,
  ): string[] {
    const startTimes: string[] = [];
    let current = this.parseTimeString(startTime, timezone);
    const end = this.parseTimeString(endTime, timezone);

    while (current < end) {
      const next = current.plus({ minutes: duration });
      if (next > end) break;
      startTimes.push(current.toFormat(this.TIME_FORMAT));
      current = next;
    }
    return startTimes;
  }

  static getMonthStartDate(monthString: string, timezone: string) {
    return this.parseMonthString(monthString, timezone)
      .startOf('month')
      .toISODate();
  }

  static getMonthEndDate(monthString: string, timezone: string) {
    return this.parseMonthString(monthString, timezone)
      .endOf('month')
      .toISODate();
  }

  static getMonthDatesByWeekday(
    monthString: string,
    weekday: Weekday,
    timezone: string,
  ): string[] {
    const start = this.parseMonthString(monthString, timezone).startOf('month');
    const end = start.endOf('month');
    const dates: string[] = [];
    let current = start;

    while (current <= end) {
      const day = current.weekdayLong;
      if (day && day.toLowerCase() === weekday.toLowerCase()) {
        dates.push(current.toISODate());
      }
      current = current.plus({ days: 1 });
    }
    return dates;
  }

  static getAllMonthDates(monthString: string, timezone: string): string[] {
    const start = this.parseMonthString(monthString, timezone).startOf('month');
    const end = start.endOf('month');
    const dates: string[] = [];
    let current = start;

    while (current <= end) {
      dates.push(current.toISODate());
      current = current.plus({ days: 1 });
    }
    return dates;
  }

  static formatDateString(date: Date | string): string {
    const dt =
      typeof date === 'string'
        ? DateTime.fromISO(date)
        : DateTime.fromJSDate(date);
    return dt.toFormat(this.DATE_FORMAT);
  }

  static formatTimeString(time: string): string {
    return this.parseTimeString(time).toFormat(this.TIME_FORMAT);
  }

  static splitDateRangeAcrossZones(
    baseTz: string,
    otherTz: string,
    dateString: string,
    startTime: string,
    endTime: string,
  ): { date: string; startTime: string; endTime: string }[] {
    const startISO = `${dateString}T${startTime}`;
    const endISO = `${dateString}T${endTime}`;

    const baseStart = DateTime.fromISO(startISO, { zone: baseTz });
    const baseEnd = DateTime.fromISO(endISO, { zone: baseTz });
    const otherStart = baseStart.setZone(otherTz);
    const otherEnd = baseEnd.setZone(otherTz);

    if (
      !baseStart.isValid ||
      !baseEnd.isValid ||
      !otherStart.isValid ||
      !otherEnd.isValid
    ) {
      return [];
    }

    const isInSameDate = otherStart.toISODate() === otherEnd.toISODate();
    const baseDates = [
      {
        date: otherStart.toISODate(),
        startTime: otherStart.toFormat(this.TIME_FORMAT),
        endTime: otherStart.toFormat(this.TIME_FORMAT),
      },
    ];
    const splitDates = [
      {
        date: otherStart.toISODate(),
        startTime: otherStart.toFormat(this.TIME_FORMAT),
        endTime: this.END_TIME_OF_DAY,
      },
      {
        date: otherEnd.toISODate(),
        startTime: this.START_TIME_OF_DAY,
        endTime: otherEnd.toFormat(this.TIME_FORMAT),
      },
    ];
    return isInSameDate ? baseDates : splitDates;
  }

  static generateSlots(
    startTime: string,
    endTime: string,
    duration: number,
  ): string[] {
    const slots: string[] = [];
    let current = this.parseTimeString(startTime);
    const end = this.parseTimeString(endTime);

    while (current <= end) {
      const next = current.plus({ minutes: duration });
      if (next.day > current.day || next > end) break;
      slots.push(current.toFormat(this.TIME_FORMAT));
      current = next;
    }
    return slots;
  }

  static convertTimeZone(baseTz: string, otherTz: string, time: string) {
    return this.parseTimeString(time, baseTz)
      .setZone(otherTz)
      .toFormat(this.TIME_FORMAT);
  }
}
