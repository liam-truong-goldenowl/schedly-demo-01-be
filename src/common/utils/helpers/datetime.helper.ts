import { DateTime } from 'luxon';

import { Weekday } from '@/common/enums';

export class DateTimeHelper {
  static readonly DATE_FORMAT = 'yyyy-MM-dd';
  static readonly MONTH_FORMAT = 'yyyy-MM';
  static readonly TIME_FORMAT = 'HH:mm';
  static readonly TIME_FORMAT_WITH_SECONDS = 'HH:mm:ss';
  static readonly START_TIME_OF_DAY = '00:00';
  static readonly END_TIME_OF_DAY = '23:59';
  static readonly DEFAULT_TIMEZONE = 'UTC';

  static getTimeFormat(timeString: string): string {
    return timeString.length === 5
      ? this.TIME_FORMAT
      : this.TIME_FORMAT_WITH_SECONDS;
  }

  static parseTimeString(timeString: string, timezone = this.DEFAULT_TIMEZONE) {
    const format = this.getTimeFormat(timeString);
    const dt = DateTime.fromFormat(timeString, format, { zone: timezone });
    if (!dt.isValid) {
      throw new Error(`Invalid time: ${timeString}`);
    }
    return dt;
  }

  static parseMonthString(
    monthString: string,
    timezone = this.DEFAULT_TIMEZONE,
  ) {
    const dt = DateTime.fromFormat(monthString, this.MONTH_FORMAT, {
      zone: timezone,
    });
    if (!dt.isValid) {
      throw new Error(`Invalid month: ${monthString}`);
    }
    return dt;
  }

  static parseDateString(dateString: string, timezone = this.DEFAULT_TIMEZONE) {
    const dt = DateTime.fromFormat(dateString, this.DATE_FORMAT, {
      zone: timezone,
    });
    if (!dt.isValid) {
      throw new Error(`Invalid date: ${dateString}`);
    }
    return dt;
  }

  static parseIsoDateString(
    dateString: string,
    timezone = this.DEFAULT_TIMEZONE,
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

  static getWeekdayEnum(
    dateStr: string,
    timezone = this.DEFAULT_TIMEZONE,
  ): Weekday {
    const dt = this.parseIsoDateString(dateStr, timezone);
    const day = dt.weekdayLong!.toUpperCase();
    if (day in Weekday) {
      return Weekday[day as keyof typeof Weekday];
    }
    throw new Error(`Invalid weekday: ${day}`);
  }

  static addMinutes(
    timeString: string,
    minutes: number,
    timezone = this.DEFAULT_TIMEZONE,
  ) {
    const format = this.getTimeFormat(timeString);
    const parsed = this.parseTimeString(timeString, timezone);
    return parsed.plus({ minutes }).toFormat(format);
  }

  static generatePossibleStartTimes(
    startTime: string,
    endTime: string,
    duration: number,
  ): string[] {
    const startTimes: string[] = [];
    let current = this.parseTimeString(startTime);
    const end = this.parseTimeString(endTime);

    while (current < end) {
      const next = current.plus({ minutes: duration });
      if (next > end) break;
      startTimes.push(current.toFormat(this.TIME_FORMAT));
      current = next;
    }
    return startTimes;
  }

  static getMonthStartDate(monthString: string) {
    return this.parseMonthString(monthString).startOf('month').toISODate();
  }

  static getMonthEndDate(monthString: string) {
    return this.parseMonthString(monthString).endOf('month').toISODate();
  }

  static getMonthDatesByWeekday(
    monthString: string,
    weekday: Weekday,
  ): string[] {
    const start = this.parseMonthString(monthString).startOf('month');
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

  static getAllMonthDates(monthString: string): string[] {
    const start = this.parseMonthString(monthString).startOf('month');
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
    const dateString =
      typeof date == 'string' ? date : date.toLocaleDateString().split('T')[0];
    return this.parseDateString(dateString).toFormat(this.DATE_FORMAT);
  }

  static formatTimeString(time: string): string {
    return this.parseTimeString(time).toFormat(this.TIME_FORMAT);
  }

  static convertTimeZone(baseTz: string, otherTz: string, time: string) {
    return this.parseTimeString(time, baseTz)
      .setZone(otherTz)
      .toFormat(this.TIME_FORMAT);
  }
}
