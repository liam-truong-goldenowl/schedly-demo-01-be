import { Weekday } from '@/common/enums';

import {
  getWeekday,
  getZonedTime,
  isOverlapping,
  addMinutesToTime,
  getEndDateOfMonth,
  getDatesByWeekday,
  getStartDateOfMonth,
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

    expect(result).toEqual(['09:00']);
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
describe('getZonedTime', () => {
  it('should return the same time string in HH:mm format', () => {
    expect(getZonedTime('10:30', 'UTC')).toBe('10:30');
    expect(getZonedTime('09:15', 'America/New_York')).toBe('09:15');
    expect(getZonedTime('23:45', 'Asia/Tokyo')).toBe('23:45');
  });

  it('should return the same time string in HH:mm:ss format', () => {
    expect(getZonedTime('10:30:45', 'UTC')).toBe('10:30:45');
    expect(getZonedTime('09:15:30', 'America/New_York')).toBe('09:15:30');
    expect(getZonedTime('23:45:00', 'Asia/Tokyo')).toBe('23:45:00');
  });

  it('should handle edge cases like midnight and noon', () => {
    expect(getZonedTime('00:00', 'UTC')).toBe('00:00');
    expect(getZonedTime('12:00', 'UTC')).toBe('12:00');
    expect(getZonedTime('00:00:00', 'America/New_York')).toBe('00:00:00');
    expect(getZonedTime('12:00:00', 'Asia/Tokyo')).toBe('12:00:00');
  });
});

describe('getStartDateOfMonth', () => {
  it('should return the start date of the month in ISO format', () => {
    expect(getStartDateOfMonth('2025-01', 'UTC')).toBe('2025-01-01');
    expect(getStartDateOfMonth('2025-12', 'UTC')).toBe('2025-12-01');
    expect(getStartDateOfMonth('2024-02', 'UTC')).toBe('2024-02-01');
  });

  it('should handle different timezones', () => {
    expect(getStartDateOfMonth('2025-01', 'America/New_York')).toBe(
      '2025-01-01',
    );
    expect(getStartDateOfMonth('2025-01', 'Asia/Tokyo')).toBe('2025-01-01');
    expect(getStartDateOfMonth('2025-01', 'Europe/London')).toBe('2025-01-01');
  });

  it('should handle leap year February', () => {
    expect(getStartDateOfMonth('2024-02', 'UTC')).toBe('2024-02-01');
    expect(getStartDateOfMonth('2023-02', 'UTC')).toBe('2023-02-01');
  });
});

describe('getEndDateOfMonth', () => {
  it('should return the end date of the month in ISO format', () => {
    expect(getEndDateOfMonth('2025-01', 'UTC')).toBe('2025-01-31');
    expect(getEndDateOfMonth('2025-04', 'UTC')).toBe('2025-04-30');
    expect(getEndDateOfMonth('2025-02', 'UTC')).toBe('2025-02-28');
  });

  it('should handle leap year February correctly', () => {
    expect(getEndDateOfMonth('2024-02', 'UTC')).toBe('2024-02-29');
    expect(getEndDateOfMonth('2023-02', 'UTC')).toBe('2023-02-28');
  });

  it('should handle different timezones', () => {
    expect(getEndDateOfMonth('2025-01', 'America/New_York')).toBe('2025-01-31');
    expect(getEndDateOfMonth('2025-01', 'Asia/Tokyo')).toBe('2025-01-31');
    expect(getEndDateOfMonth('2025-01', 'Europe/London')).toBe('2025-01-31');
  });

  it('should handle months with different day counts', () => {
    expect(getEndDateOfMonth('2025-01', 'UTC')).toBe('2025-01-31'); // 31 days
    expect(getEndDateOfMonth('2025-04', 'UTC')).toBe('2025-04-30'); // 30 days
    expect(getEndDateOfMonth('2025-02', 'UTC')).toBe('2025-02-28'); // 28 days
    expect(getEndDateOfMonth('2025-12', 'UTC')).toBe('2025-12-31'); // 31 days
  });
});

describe('getDatesByWeekday', () => {
  it('should return all Mondays in a month', () => {
    const result = getDatesByWeekday('2025-01', Weekday.MONDAY, 'UTC');
    expect(result).toEqual([
      '2025-01-06',
      '2025-01-13',
      '2025-01-20',
      '2025-01-27',
    ]);
  });

  it('should return all Sundays in a month', () => {
    const result = getDatesByWeekday('2025-01', Weekday.SUNDAY, 'UTC');
    expect(result).toEqual([
      '2025-01-05',
      '2025-01-12',
      '2025-01-19',
      '2025-01-26',
    ]);
  });

  it('should handle February in a leap year', () => {
    const result = getDatesByWeekday('2024-02', Weekday.THURSDAY, 'UTC');
    expect(result).toEqual([
      '2024-02-01',
      '2024-02-08',
      '2024-02-15',
      '2024-02-22',
      '2024-02-29',
    ]);
  });

  it('should handle February in a non-leap year', () => {
    const result = getDatesByWeekday('2023-02', Weekday.TUESDAY, 'UTC');
    expect(result).toEqual([
      '2023-02-07',
      '2023-02-14',
      '2023-02-21',
      '2023-02-28',
    ]);
  });

  it('should handle months with 30 days', () => {
    const result = getDatesByWeekday('2025-04', Weekday.WEDNESDAY, 'UTC');
    expect(result).toEqual([
      '2025-04-02',
      '2025-04-09',
      '2025-04-16',
      '2025-04-23',
      '2025-04-30',
    ]);
  });

  it('should handle case where weekday appears only 4 times in month', () => {
    const result = getDatesByWeekday('2025-02', Weekday.SATURDAY, 'UTC');
    expect(result).toEqual([
      '2025-02-01',
      '2025-02-08',
      '2025-02-15',
      '2025-02-22',
    ]);
  });

  it('should work with different timezones', () => {
    const resultUTC = getDatesByWeekday('2025-01', Weekday.FRIDAY, 'UTC');
    const resultNY = getDatesByWeekday(
      '2025-01',
      Weekday.FRIDAY,
      'America/New_York',
    );

    expect(resultUTC).toEqual([
      '2025-01-03',
      '2025-01-10',
      '2025-01-17',
      '2025-01-24',
      '2025-01-31',
    ]);
    expect(resultNY).toEqual([
      '2025-01-03',
      '2025-01-10',
      '2025-01-17',
      '2025-01-24',
      '2025-01-31',
    ]);
  });

  it('should return empty array if no matching weekday in month', () => {
    // This shouldn't happen in practice, but testing edge case
    const result = getDatesByWeekday(
      '2025-01',
      'INVALID_DAY' as Weekday,
      'UTC',
    );
    expect(result).toEqual([]);
  });

  it('should handle all weekdays correctly', () => {
    Object.values(Weekday).forEach((weekday) => {
      const result = getDatesByWeekday('2025-01', weekday, 'UTC');
      expect(result.length).toBeGreaterThanOrEqual(4);
      expect(result.length).toBeLessThanOrEqual(5);

      // Verify all dates are valid and in correct month
      result.forEach((date) => {
        expect(date).toMatch(/^2025-01-\d{2}$/);
      });
    });
  });
});
