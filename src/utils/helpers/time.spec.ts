import { Weekday } from '@/common/enums';

import {
  getWeekday,
  isOverlapping,
  addMinutesToTime,
  generateValidTimeStartTimes,
} from './time';

describe('isOverlapping (object signature)', () => {
  it('should return true when intervals overlap', () => {
    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '11:00', endTime: '13:00' },
      ),
    ).toBe(true);

    expect(
      isOverlapping(
        { startTime: '09:00', endTime: '11:00' },
        { startTime: '10:00', endTime: '12:00' },
      ),
    ).toBe(true);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '10:30', endTime: '11:30' },
      ),
    ).toBe(true);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '09:00', endTime: '10:30' },
      ),
    ).toBe(true);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '11:59', endTime: '12:01' },
      ),
    ).toBe(true);
  });

  it('should return false when intervals do not overlap', () => {
    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '12:00', endTime: '13:00' },
      ),
    ).toBe(false);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '08:00', endTime: '10:00' },
      ),
    ).toBe(false);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '12:01', endTime: '13:00' },
      ),
    ).toBe(false);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '08:00', endTime: '09:59' },
      ),
    ).toBe(false);
  });

  it('should return false when intervals touch but do not overlap', () => {
    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '12:00', endTime: '14:00' },
      ),
    ).toBe(false);

    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '08:00', endTime: '10:00' },
      ),
    ).toBe(false);
  });

  it('should return true when intervals are exactly the same', () => {
    expect(
      isOverlapping(
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '10:00', endTime: '12:00' },
      ),
    ).toBe(true);
  });
});

describe('getWeekday', () => {
  it('should return the correct weekday enum value for a valid date', () => {
    expect(getWeekday('2025-08-11', 'UTC')).toBe(Weekday.MONDAY);
    expect(getWeekday('2025-08-12', 'UTC')).toBe(Weekday.TUESDAY);
    expect(getWeekday('2025-08-13', 'UTC')).toBe(Weekday.WEDNESDAY);
    expect(getWeekday('2025-08-14', 'UTC')).toBe(Weekday.THURSDAY);
    expect(getWeekday('2025-08-15', 'UTC')).toBe(Weekday.FRIDAY);
    expect(getWeekday('2025-08-16', 'UTC')).toBe(Weekday.SATURDAY);
    expect(getWeekday('2025-08-17', 'UTC')).toBe(Weekday.SUNDAY);
  });

  it('should handle different timezones correctly', () => {
    // Same point in time should return different weekdays in different timezones
    const dateStr = '2025-08-17T23:00:00Z'; // Sunday in UTC
    expect(getWeekday(dateStr, 'UTC')).toBe(Weekday.SUNDAY);
    expect(getWeekday(dateStr, 'America/New_York')).toBe(Weekday.SUNDAY);
    expect(getWeekday(dateStr, 'Asia/Tokyo')).toBe(Weekday.MONDAY); // Already Monday in Tokyo
  });

  it('should throw an error for invalid date strings', () => {
    expect(() => getWeekday('invalid-date', 'UTC')).toThrow();
  });
});
describe('addMinutesToTime', () => {
  it('should add minutes correctly to a time string in HH:mm format', () => {
    expect(
      addMinutesToTime({
        timeString: '10:00',
        minutes: 30,
        timezone: 'UTC',
      }),
    ).toBe('10:30');

    expect(
      addMinutesToTime({
        timeString: '23:45',
        minutes: 20,
        timezone: 'UTC',
      }),
    ).toBe('00:05');
  });

  it('should add minutes correctly to a time string in HH:mm:ss format', () => {
    expect(
      addMinutesToTime({
        timeString: '10:00:00',
        minutes: 30,
        timezone: 'UTC',
      }),
    ).toBe('10:30:00');

    expect(
      addMinutesToTime({
        timeString: '23:45:00',
        minutes: 20,
        timezone: 'UTC',
      }),
    ).toBe('00:05:00');
  });

  it('should handle negative minutes', () => {
    expect(
      addMinutesToTime({
        timeString: '10:30',
        minutes: -15,
        timezone: 'UTC',
      }),
    ).toBe('10:15');

    expect(
      addMinutesToTime({
        timeString: '00:10',
        minutes: -20,
        timezone: 'UTC',
      }),
    ).toBe('23:50');
  });

  it('should respect different timezones', () => {
    const result1 = addMinutesToTime({
      timeString: '23:45',
      minutes: 30,
      timezone: 'UTC',
    });

    const result2 = addMinutesToTime({
      timeString: '23:45',
      minutes: 30,
      timezone: 'America/New_York',
    });

    expect(result1).toBe('00:15');
    expect(result2).toBe('00:15');
  });
});

describe('generateValidTimeStartTimes', () => {
  it('should generate correct start times with equal intervals', () => {
    const result = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '10:00',
      duration: 15,
      timezone: 'UTC',
    });

    expect(result).toEqual(['09:00', '09:15', '09:30', '09:45']);
  });

  it('should handle case where end time is exactly reached', () => {
    const result = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '10:00',
      duration: 30,
      timezone: 'UTC',
    });

    expect(result).toEqual(['09:00', '09:30']);
  });

  it('should not include times that would make sessions extend beyond end time', () => {
    const result = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '10:00',
      duration: 40,
      timezone: 'UTC',
    });

    expect(result).toEqual(['09:00', '09:40']);
  });

  it('should handle empty result when duration exceeds available time', () => {
    const result = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '09:30',
      duration: 45,
      timezone: 'UTC',
    });

    expect(result).toEqual([]);
  });

  it('should handle different timezones correctly', () => {
    const resultUTC = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '10:00',
      duration: 20,
      timezone: 'UTC',
    });

    const resultNY = generateValidTimeStartTimes({
      startTime: '09:00',
      endTime: '10:00',
      duration: 20,
      timezone: 'America/New_York',
    });

    expect(resultUTC).toEqual(['09:00', '09:20', '09:40']);
    expect(resultNY).toEqual(['09:00', '09:20', '09:40']);
  });
});
