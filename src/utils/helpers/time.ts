import { DateTime } from 'luxon';

import { Weekday } from '@/common/enums';

interface Interval {
  startTime: string;
  endTime: string;
}

export function isOverlapping(
  interval1: Interval,
  interval2: Interval,
): boolean {
  return (
    interval1.startTime < interval2.endTime &&
    interval2.startTime < interval1.endTime
  );
}

export function getWeekday(dateStr: string, zone: string): Weekday {
  const day = DateTime.fromISO(dateStr, { zone }).weekdayLong?.toUpperCase();

  if (day && day in Weekday) {
    return Weekday[day as keyof typeof Weekday];
  }

  throw new Error(`Invalid weekday: ${day}`);
}

export function addMinutesToTime({
  timeString,
  minutes,
  timezone,
}: {
  timeString: string;
  minutes: number;
  timezone: string;
}) {
  const format = timeString.length === 5 ? 'HH:mm' : 'HH:mm:ss';

  const time = DateTime.fromFormat(timeString, format, { zone: timezone });

  return time.plus({ minutes }).toFormat(format);
}

export function getZonedTime(timeString: string, timezone: string) {
  const format = timeString.length === 5 ? 'HH:mm' : 'HH:mm:ss';
  const time = DateTime.fromFormat(timeString, format, { zone: timezone });
  return time.toFormat(format);
}

export function generateValidTimeStartTimes({
  startTime,
  endTime,
  duration,
  timezone,
}: {
  startTime: string;
  endTime: string;
  duration: number;
  timezone: string;
}): string[] {
  const startTimes: string[] = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const nextTime = addMinutesToTime({
      timeString: currentTime,
      minutes: duration,
      timezone,
    });
    if (nextTime > endTime) break;
    startTimes.push(currentTime);
    currentTime = nextTime;
  }

  return startTimes;
}

export function getStartDateOfMonth(monthString: string, timezone: string) {
  const date = DateTime.fromFormat(monthString, 'yyyy-MM', { zone: timezone });
  return date.startOf('month').toISODate();
}

export function getEndDateOfMonth(monthString: string, timezone: string) {
  const date = DateTime.fromFormat(monthString, 'yyyy-MM', { zone: timezone });
  return date.endOf('month').toISODate();
}

/**
 * @param monthString - in format YYYY-MM
 * @param weekday - 1 = Monday, 7 = Sunday (Luxon convention)
 * @returns array of YYYY-MM-DD strings
 */
export function getDatesByWeekday(
  monthString: string,
  weekday: Weekday,
  timezone: string,
): string[] {
  const start = DateTime.fromFormat(monthString, 'yyyy-MM', {
    zone: timezone,
  }).startOf('month');
  const end = start.endOf('month');

  let current = start;
  const dates: string[] = [];

  while (current <= end && current.isValid) {
    if (current.weekdayLong.toLowerCase() === weekday.toLocaleLowerCase()) {
      dates.push(current.toISODate());
    }
    current = current.plus({ days: 1 });
  }

  return dates;
}

export function getAllDatesOfAMonth(
  monthString: string,
  timezone: string,
): string[] {
  const dt = DateTime.fromFormat(monthString, 'yyyy-MM', {
    zone: timezone,
  });
  const start = dt.startOf('month');
  const end = dt.endOf('month');

  const dates: string[] = [];
  let current = start;

  while (current <= end) {
    const dateString = current.toISODate();
    if (dateString) {
      dates.push(dateString);
    }
    current = current.plus({ days: 1 });
  }

  return dates;
}

export function formatDateString(date: Date): string {
  const dt = DateTime.fromJSDate(date);
  return dt.toFormat('yyyy-MM-dd');
}

export function formatTimeString(time: string): string {
  const format = time.length === 5 ? 'HH:mm' : 'HH:mm:ss';
  const dt = DateTime.fromFormat(time, format);
  return dt.toFormat('HH:mm');
}

export function convertTimeZone({
  baseTz,
  otherTz,
  dateString,
  startTimeString,
  endTimeString,
}: {
  baseTz: string;
  otherTz: string;
  dateString: string;
  startTimeString: string;
  endTimeString: string;
}): Array<{
  date: string;
  startTimeString: string;
  endTimeString: string;
}> {
  // Combine date and time strings into ISO format
  const startISO = `${dateString}T${startTimeString}`;
  const endISO = `${dateString}T${endTimeString}`;

  // Parse in base timezone
  const baseStart = DateTime.fromISO(startISO, { zone: baseTz });
  const baseEnd = DateTime.fromISO(endISO, { zone: baseTz });

  // Convert to target timezone
  const otherStart = baseStart.setZone(otherTz);
  const otherEnd = baseEnd.setZone(otherTz);

  if (!otherStart.isValid || !otherEnd.isValid) {
    return [];
  }

  const startDate = otherStart.toISODate();
  const endDate = otherEnd.toISODate();

  if (startDate === endDate) {
    return [
      {
        date: startDate,
        startTimeString: otherStart.toFormat('HH:mm'),
        endTimeString: otherEnd.toFormat('HH:mm'),
      },
    ];
  }

  return [
    {
      date: startDate,
      startTimeString: otherStart.toFormat('HH:mm'),
      endTimeString: '23:59',
    },
    {
      date: endDate,
      startTimeString: '00:00',
      endTimeString: otherEnd.toFormat('HH:mm'),
    },
  ];
}

export function generateTimeSlots({
  startTime,
  endTime,
  duration,
}: {
  startTime: string;
  endTime: string;
  duration: number;
}): string[] {
  const slots: string[] = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    const format = currentTime.length === 5 ? 'HH:mm' : 'HH:mm:ss';
    const time = DateTime.fromFormat(currentTime, format);
    const nextTime = time.plus({ minutes: duration });

    if (nextTime.day > time.day) {
      break;
    }

    const nextTimeString = nextTime.toFormat(format);
    if (nextTimeString > endTime) {
      break;
    }
    slots.push(currentTime);
    currentTime = nextTimeString;
  }

  return slots;
}

export function getOffsetTime({
  baseTz,
  otherTz,
  timeString,
}: {
  baseTz: string;
  otherTz: string;
  timeString: string;
}) {
  const format = timeString.length === 5 ? 'HH:mm' : 'HH:mm:ss';
  const time = DateTime.fromFormat(timeString, format, { zone: baseTz });
  return time.setZone(otherTz).toFormat('HH:mm');
}
