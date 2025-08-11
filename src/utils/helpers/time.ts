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
