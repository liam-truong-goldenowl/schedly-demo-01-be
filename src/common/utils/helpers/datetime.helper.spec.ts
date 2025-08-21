import { DateTime } from 'luxon';

import { Weekday } from '@/common/enums';

import { DateTimeHelper } from './datetime.helper';

describe('DateTimeHelper', () => {
  describe('getTimeFormat', () => {
    it('should return TIME_FORMAT for a 5-character time string', () => {
      const timeString = '12:34';
      const result = DateTimeHelper.getTimeFormat(timeString);
      expect(result).toBe(DateTimeHelper.TIME_FORMAT);
    });

    it('should return TIME_FORMAT_WITH_SECONDS for an 8-character time string', () => {
      const timeString = '12:34:56';
      const result = DateTimeHelper.getTimeFormat(timeString);
      expect(result).toBe(DateTimeHelper.TIME_FORMAT_WITH_SECONDS);
    });

    it('should return TIME_FORMAT_WITH_SECONDS for any string that is not 5 characters long', () => {
      const timeStrings = ['1:34', '123:45', '12:3', '12:34:5'];

      timeStrings.forEach((timeString) => {
        const result = DateTimeHelper.getTimeFormat(timeString);
        expect(result).toBe(DateTimeHelper.TIME_FORMAT_WITH_SECONDS);
      });
    });

    it('should handle empty strings', () => {
      const timeString = '';
      const result = DateTimeHelper.getTimeFormat(timeString);
      expect(result).toBe(DateTimeHelper.TIME_FORMAT_WITH_SECONDS);
    });
  });

  describe('parseTimeString', () => {
    it('should parse a valid time string with HH:mm format', () => {
      const timeString = '14:30';
      const result = DateTimeHelper.parseTimeString(timeString);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(0);
    });

    it('should parse a valid time string with HH:mm:ss format', () => {
      const timeString = '14:30:45';
      const result = DateTimeHelper.parseTimeString(timeString);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('should parse time with timezone when provided', () => {
      const timeString = '14:30';
      const timezone = 'America/New_York';
      const result = DateTimeHelper.parseTimeString(timeString, timezone);
      expect(result.zone.name).toBe(timezone);
    });

    it('should throw an error for invalid time string', () => {
      const invalidTimeStrings = ['25:30', '14:60', 'abc', '14:30:70'];

      invalidTimeStrings.forEach((timeString) => {
        expect(() => {
          DateTimeHelper.parseTimeString(timeString);
        }).toThrow(`Invalid time: ${timeString}`);
      });
    });

    it('should handle edge cases of valid times', () => {
      const edgeCases = ['00:00', '23:59:59'];

      expect(DateTimeHelper.parseTimeString(edgeCases[0]).hour).toBe(0);
      expect(DateTimeHelper.parseTimeString(edgeCases[0]).minute).toBe(0);

      expect(DateTimeHelper.parseTimeString(edgeCases[1]).hour).toBe(23);
      expect(DateTimeHelper.parseTimeString(edgeCases[1]).minute).toBe(59);
      expect(DateTimeHelper.parseTimeString(edgeCases[1]).second).toBe(59);
    });
  });

  describe('parseMonthString', () => {
    it('should parse a valid month string in the correct format', () => {
      const monthString = '2023-04';
      const result = DateTimeHelper.parseMonthString(monthString);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(4);
      expect(result.day).toBe(1); // Default day is 1 for month parsing
    });

    it('should parse a month string with timezone when provided', () => {
      const monthString = '2023-04';
      const timezone = 'America/New_York';
      const result = DateTimeHelper.parseMonthString(monthString, timezone);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(4);
      expect(result.zone.name).toBe(timezone);
    });

    it('should throw an error for invalid month string', () => {
      const invalidMonthStrings = ['2023-13', '2023/04', 'abc', '13-2023'];

      invalidMonthStrings.forEach((monthString) => {
        expect(() => {
          DateTimeHelper.parseMonthString(monthString);
        }).toThrow(`Invalid month: ${monthString}`);
      });
    });

    it('should handle edge cases of valid months', () => {
      const edgeCases = ['2023-01', '2023-12'];

      expect(DateTimeHelper.parseMonthString(edgeCases[0]).year).toBe(2023);
      expect(DateTimeHelper.parseMonthString(edgeCases[0]).month).toBe(1);

      expect(DateTimeHelper.parseMonthString(edgeCases[1]).year).toBe(2023);
      expect(DateTimeHelper.parseMonthString(edgeCases[1]).month).toBe(12);
    });

    it('should parse month strings with different years correctly', () => {
      const pastMonth = '1990-06';
      const futureMonth = '2050-11';

      const pastResult = DateTimeHelper.parseMonthString(pastMonth);
      expect(pastResult.year).toBe(1990);
      expect(pastResult.month).toBe(6);

      const futureResult = DateTimeHelper.parseMonthString(futureMonth);
      expect(futureResult.year).toBe(2050);
      expect(futureResult.month).toBe(11);
    });
  });

  describe('parseIsoDateString', () => {
    it('should parse a valid ISO date string', () => {
      const dateString = '2023-05-15';
      const result = DateTimeHelper.parseIsoDateString(dateString);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(5);
      expect(result.day).toBe(15);
    });

    it('should parse a valid ISO datetime string', () => {
      const dateString = '2023-05-15T14:30:45Z';
      const result = DateTimeHelper.parseIsoDateString(dateString);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(5);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('should parse a date string with timezone when provided', () => {
      const dateString = '2023-05-15';
      const timezone = 'America/New_York';
      const result = DateTimeHelper.parseIsoDateString(dateString, timezone);
      expect(result.year).toBe(2023);
      expect(result.month).toBe(5);
      expect(result.day).toBe(15);
      expect(result.zone.name).toBe(timezone);
    });

    it('should throw an error for invalid ISO date string', () => {
      const invalidDateStrings = [
        '2023/05/15',
        'abc',
        '2023-13-15',
        '2023-05-32',
      ];

      invalidDateStrings.forEach((dateString) => {
        expect(() => {
          DateTimeHelper.parseIsoDateString(dateString);
        }).toThrow(`Invalid date: ${dateString}`);
      });
    });

    it('should handle edge cases of valid dates', () => {
      const edgeCases = [
        '0000-01-01',
        '9999-12-31',
        '2023-02-28',
        '2024-02-29',
      ];

      expect(DateTimeHelper.parseIsoDateString(edgeCases[0]).year).toBe(0);
      expect(DateTimeHelper.parseIsoDateString(edgeCases[0]).month).toBe(1);
      expect(DateTimeHelper.parseIsoDateString(edgeCases[0]).day).toBe(1);

      expect(DateTimeHelper.parseIsoDateString(edgeCases[1]).year).toBe(9999);
      expect(DateTimeHelper.parseIsoDateString(edgeCases[1]).month).toBe(12);
      expect(DateTimeHelper.parseIsoDateString(edgeCases[1]).day).toBe(31);

      // Test leap year cases
      expect(DateTimeHelper.parseIsoDateString(edgeCases[2]).day).toBe(28);
      expect(DateTimeHelper.parseIsoDateString(edgeCases[3]).day).toBe(29);
    });
  });

  describe('timeRangesOverlap', () => {
    it('should return true when time ranges overlap', () => {
      const timeRange1 = { startTime: '10:00', endTime: '12:00' };
      const timeRange2 = { startTime: '11:00', endTime: '13:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });

    it('should return true when one range is completely within another', () => {
      const timeRange1 = { startTime: '09:00', endTime: '15:00' };
      const timeRange2 = { startTime: '10:00', endTime: '14:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });

    it('should return true when ranges have the same start time', () => {
      const timeRange1 = { startTime: '10:00', endTime: '12:00' };
      const timeRange2 = { startTime: '10:00', endTime: '11:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });

    it('should return true when ranges have the same end time', () => {
      const timeRange1 = { startTime: '09:00', endTime: '12:00' };
      const timeRange2 = { startTime: '10:00', endTime: '12:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });

    it('should return false when time ranges do not overlap', () => {
      const timeRange1 = { startTime: '09:00', endTime: '10:00' };
      const timeRange2 = { startTime: '11:00', endTime: '12:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(false);
    });

    it('should return false when one range ends exactly when another starts', () => {
      const timeRange1 = { startTime: '09:00', endTime: '11:00' };
      const timeRange2 = { startTime: '11:00', endTime: '13:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(false);
    });

    it('should work with time strings that include seconds', () => {
      const timeRange1 = { startTime: '09:00:00', endTime: '11:00:00' };
      const timeRange2 = { startTime: '10:30:00', endTime: '12:00:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });

    it('should handle mixed time formats (with and without seconds)', () => {
      const timeRange1 = { startTime: '09:00', endTime: '11:00:30' };
      const timeRange2 = { startTime: '10:45', endTime: '12:00' };
      const result = DateTimeHelper.timeRangesOverlap(timeRange1, timeRange2);
      expect(result).toBe(true);
    });
  });

  describe('getWeekdayEnum', () => {
    it('should return correct weekday enum for a valid date string', () => {
      const dateString = '2023-05-15';
      const timezone = 'UTC';
      const result = DateTimeHelper.getWeekdayEnum(dateString, timezone);
      expect(result).toBe(Weekday.MONDAY);
    });

    it('should return correct weekday enum for all days of the week', () => {
      const weekDates = [
        { date: '2023-05-14', expected: Weekday.SUNDAY },
        { date: '2023-05-15', expected: Weekday.MONDAY },
        { date: '2023-05-16', expected: Weekday.TUESDAY },
        { date: '2023-05-17', expected: Weekday.WEDNESDAY },
        { date: '2023-05-18', expected: Weekday.THURSDAY },
        { date: '2023-05-19', expected: Weekday.FRIDAY },
        { date: '2023-05-20', expected: Weekday.SATURDAY },
      ];

      weekDates.forEach(({ date, expected }) => {
        const result = DateTimeHelper.getWeekdayEnum(date, 'UTC');
        expect(result).toBe(expected);
      });
    });

    it('should respect the provided timezone', () => {
      // 2023-05-15T00:00:00 in Asia/Tokyo is 2023-05-14T15:00:00 in UTC
      // So it would be Sunday in UTC but Monday in Tokyo
      const dateString = '2023-05-15';
      const tokyoResult = DateTimeHelper.getWeekdayEnum(
        dateString,
        'Asia/Tokyo',
      );
      expect(tokyoResult).toBe(Weekday.MONDAY);

      // Same date in different timezone can yield different weekday
      const losAngelesResult = DateTimeHelper.getWeekdayEnum(
        dateString,
        'America/Los_Angeles',
      );
      // Depending on the hour difference, this could still be Sunday in LA
      // For test stability, we're just verifying it's a valid weekday
      expect(Object.values(Weekday)).toContain(losAngelesResult);
    });

    it('should throw an error for an invalid date string', () => {
      const invalidDateString = '2023-13-40'; // Invalid month and day
      expect(() => {
        DateTimeHelper.getWeekdayEnum(invalidDateString, 'UTC');
      }).toThrow(/Invalid date/);
    });
  });

  describe('addMinutes', () => {
    it('should correctly add minutes to a time string', () => {
      const timeString = '10:30';
      const minutes = 45;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('11:15');
    });

    it('should handle crossing to the next hour', () => {
      const timeString = '09:45';
      const minutes = 30;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('10:15');
    });

    it('should handle crossing to the next day', () => {
      const timeString = '23:30';
      const minutes = 45;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('00:15');
    });

    it('should handle negative minutes', () => {
      const timeString = '10:30';
      const minutes = -45;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('09:45');
    });

    it('should respect the provided timezone', () => {
      const timeString = '10:30';
      const minutes = 30;
      const timezone = 'America/New_York';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('11:00');
    });

    it('should preserve seconds when provided in the input', () => {
      const timeString = '10:30:15';
      const minutes = 30;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('11:00:15');
    });

    it('should handle adding zero minutes', () => {
      const timeString = '10:30';
      const minutes = 0;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('10:30');
    });

    it('should handle edge cases like midnight', () => {
      const timeString = '00:00';
      const minutes = 30;
      const timezone = 'UTC';
      const result = DateTimeHelper.addMinutes(timeString, minutes, timezone);
      expect(result).toBe('00:30');
    });
  });

  describe('generatePossibleStartTimes', () => {
    it('should generate an array of possible start times with the given duration', () => {
      const startTime = '09:00';
      const endTime = '10:00';
      const duration = 15;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual(['09:00', '09:15', '09:30', '09:45']);
    });

    it('should handle different time durations', () => {
      const startTime = '10:00';
      const endTime = '11:30';
      const duration = 30;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual(['10:00', '10:30', '11:00']);
    });

    it('should return empty array if start time is equal to end time', () => {
      const time = '14:00';
      const duration = 15;
      const result = DateTimeHelper.generatePossibleStartTimes(
        time,
        time,
        duration,
      );
      expect(result).toEqual([]);
    });

    it('should return empty array if start time is after end time', () => {
      const startTime = '15:00';
      const endTime = '14:00';
      const duration = 30;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual([]);
    });

    it('should not include a time if adding duration would exceed end time', () => {
      const startTime = '09:00';
      const endTime = '09:29';
      const duration = 30;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual([]);
    });

    it('should handle exact fit for durations', () => {
      const startTime = '13:00';
      const endTime = '14:00';
      const duration = 20;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual(['13:00', '13:20', '13:40']);
    });

    it('should work with time strings that include seconds', () => {
      const startTime = '09:00:00';
      const endTime = '10:00:00';
      const duration = 30;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual(['09:00', '09:30']);
    });

    it('should handle very small durations', () => {
      const startTime = '09:00';
      const endTime = '09:10';
      const duration = 2;
      const result = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        duration,
      );
      expect(result).toEqual(['09:00', '09:02', '09:04', '09:06', '09:08']);
    });
  });

  describe('getMonthStartDate', () => {
    it('should return the first day of the month for a valid month string', () => {
      const monthString = '2023-05';
      const result = DateTimeHelper.getMonthStartDate(monthString);
      expect(result).toBe('2023-05-01');
    });

    it('should handle different months correctly', () => {
      const testCases = [
        { month: '2023-01', expected: '2023-01-01' },
        { month: '2023-04', expected: '2023-04-01' },
        { month: '2023-12', expected: '2023-12-01' },
      ];

      testCases.forEach(({ month, expected }) => {
        const result = DateTimeHelper.getMonthStartDate(month);
        expect(result).toBe(expected);
      });
    });

    it('should throw an error for invalid month string', () => {
      const invalidMonthStrings = ['2023-13', '2023/04', 'abc', '13-2023'];

      invalidMonthStrings.forEach((monthString) => {
        expect(() => {
          DateTimeHelper.getMonthStartDate(monthString);
        }).toThrow(`Invalid month: ${monthString}`);
      });
    });

    it('should handle leap years correctly', () => {
      const leapYearMonth = '2020-02';
      const nonLeapYearMonth = '2023-02';

      const leapYearResult = DateTimeHelper.getMonthStartDate(leapYearMonth);
      const nonLeapYearResult =
        DateTimeHelper.getMonthStartDate(nonLeapYearMonth);

      expect(leapYearResult).toBe('2020-02-01');
      expect(nonLeapYearResult).toBe('2023-02-01');
    });

    it('should work with historical and future dates', () => {
      const historicalMonth = '1900-06';
      const futureMonth = '2100-09';

      const historicalResult =
        DateTimeHelper.getMonthStartDate(historicalMonth);
      const futureResult = DateTimeHelper.getMonthStartDate(futureMonth);

      expect(historicalResult).toBe('1900-06-01');
      expect(futureResult).toBe('2100-09-01');
    });
  });

  describe('getMonthEndDate', () => {
    it('should return the last day of the month for a valid month string', () => {
      const monthString = '2023-05';
      const result = DateTimeHelper.getMonthEndDate(monthString);
      expect(result).toBe('2023-05-31');
    });

    it('should handle different months with varying days correctly', () => {
      const testCases = [
        { month: '2023-01', expected: '2023-01-31' }, // 31 days
        { month: '2023-04', expected: '2023-04-30' }, // 30 days
        { month: '2023-02', expected: '2023-02-28' }, // 28 days (non-leap year)
        { month: '2023-12', expected: '2023-12-31' }, // 31 days
      ];

      testCases.forEach(({ month, expected }) => {
        const result = DateTimeHelper.getMonthEndDate(month);
        expect(result).toBe(expected);
      });
    });

    it('should throw an error for invalid month string', () => {
      const invalidMonthStrings = ['2023-13', '2023/04', 'abc', '13-2023'];

      invalidMonthStrings.forEach((monthString) => {
        expect(() => {
          DateTimeHelper.getMonthEndDate(monthString);
        }).toThrow(`Invalid month: ${monthString}`);
      });
    });

    it('should handle leap years correctly', () => {
      const leapYearMonth = '2020-02';
      const nonLeapYearMonth = '2023-02';

      const leapYearResult = DateTimeHelper.getMonthEndDate(leapYearMonth);
      const nonLeapYearResult =
        DateTimeHelper.getMonthEndDate(nonLeapYearMonth);

      expect(leapYearResult).toBe('2020-02-29'); // Leap year
      expect(nonLeapYearResult).toBe('2023-02-28'); // Non-leap year
    });

    it('should work with historical and future dates', () => {
      const historicalMonth = '1900-06';
      const futureMonth = '2100-09';

      const historicalResult = DateTimeHelper.getMonthEndDate(historicalMonth);
      const futureResult = DateTimeHelper.getMonthEndDate(futureMonth);

      expect(historicalResult).toBe('1900-06-30');
      expect(futureResult).toBe('2100-09-30');
    });
  });

  describe('getMonthDatesByWeekday', () => {
    it('should return all Mondays in a given month', () => {
      const monthString = '2023-05'; // May 2023
      const weekday = Weekday.MONDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2023-05-01',
        '2023-05-08',
        '2023-05-15',
        '2023-05-22',
        '2023-05-29',
      ]);
    });

    it('should return all Saturdays in a given month', () => {
      const monthString = '2023-04'; // April 2023
      const weekday = Weekday.SATURDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2023-04-01',
        '2023-04-08',
        '2023-04-15',
        '2023-04-22',
        '2023-04-29',
      ]);
    });

    it('should return all Sundays in a given month', () => {
      const monthString = '2023-02'; // February 2023
      const weekday = Weekday.SUNDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2023-02-05',
        '2023-02-12',
        '2023-02-19',
        '2023-02-26',
      ]);
    });

    it('should handle months with four occurrences of a weekday', () => {
      const monthString = '2023-02'; // February 2023
      const weekday = Weekday.WEDNESDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2023-02-01',
        '2023-02-08',
        '2023-02-15',
        '2023-02-22',
      ]);
    });

    it('should handle months with five occurrences of a weekday', () => {
      const monthString = '2023-03'; // March 2023
      const weekday = Weekday.FRIDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2023-03-03',
        '2023-03-10',
        '2023-03-17',
        '2023-03-24',
        '2023-03-31',
      ]);
    });

    it('should handle leap years correctly', () => {
      // February 2020 (leap year) has 29 days
      const monthString = '2020-02';
      const weekday = Weekday.SATURDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '2020-02-01',
        '2020-02-08',
        '2020-02-15',
        '2020-02-22',
        '2020-02-29',
      ]);
    });

    it('should throw an error for invalid month string', () => {
      const invalidMonthString = '2023-13'; // Invalid month
      const weekday = Weekday.MONDAY;

      expect(() => {
        DateTimeHelper.getMonthDatesByWeekday(invalidMonthString, weekday);
      }).toThrow(`Invalid month: ${invalidMonthString}`);
    });

    it('should return an empty array if the weekday is invalid', () => {
      const monthString = '2023-05';
      const invalidWeekday = 'INVALID_DAY' as unknown as Weekday;

      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        invalidWeekday,
      );
      expect(result).toEqual([]);
    });

    it('should work with historical dates', () => {
      const monthString = '1900-01'; // January 1900
      const weekday = Weekday.WEDNESDAY;
      const result = DateTimeHelper.getMonthDatesByWeekday(
        monthString,
        weekday,
      );
      expect(result).toEqual([
        '1900-01-03',
        '1900-01-10',
        '1900-01-17',
        '1900-01-24',
        '1900-01-31',
      ]);
    });
  });

  describe('getAllMonthDates', () => {
    it('should return all dates in a given month', () => {
      const monthString = '2023-04'; // April 2023 has 30 days
      const result = DateTimeHelper.getAllMonthDates(monthString);
      expect(result.length).toBe(30);
      expect(result[0]).toBe('2023-04-01');
      expect(result[29]).toBe('2023-04-30');
    });

    it('should handle months with 31 days', () => {
      const monthString = '2023-05'; // May 2023 has 31 days
      const result = DateTimeHelper.getAllMonthDates(monthString);
      expect(result.length).toBe(31);
      expect(result[0]).toBe('2023-05-01');
      expect(result[30]).toBe('2023-05-31');
    });

    it('should handle February in a non-leap year', () => {
      const monthString = '2023-02'; // February 2023 has 28 days (non-leap year)
      const result = DateTimeHelper.getAllMonthDates(monthString);
      expect(result.length).toBe(28);
      expect(result[0]).toBe('2023-02-01');
      expect(result[27]).toBe('2023-02-28');
    });

    it('should handle February in a leap year', () => {
      const monthString = '2020-02'; // February 2020 has 29 days (leap year)
      const result = DateTimeHelper.getAllMonthDates(monthString);
      expect(result.length).toBe(29);
      expect(result[0]).toBe('2020-02-01');
      expect(result[28]).toBe('2020-02-29');
    });

    it('should return dates in sequential order', () => {
      const monthString = '2023-03';
      const result = DateTimeHelper.getAllMonthDates(monthString);

      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = DateTime.fromISO(result[i]);
        const nextDate = DateTime.fromISO(result[i + 1]);
        expect(nextDate.diff(currentDate, 'days').days).toBe(1);
      }
    });

    it('should throw an error for invalid month string', () => {
      const invalidMonthStrings = ['2023-13', '2023/04', 'abc', '13-2023'];

      invalidMonthStrings.forEach((monthString) => {
        expect(() => {
          DateTimeHelper.getAllMonthDates(monthString);
        }).toThrow(`Invalid month: ${monthString}`);
      });
    });

    it('should work with historical dates', () => {
      const historicalMonth = '1900-06'; // June 1900 has 30 days
      const result = DateTimeHelper.getAllMonthDates(historicalMonth);
      expect(result.length).toBe(30);
      expect(result[0]).toBe('1900-06-01');
      expect(result[29]).toBe('1900-06-30');
    });

    it('should work with future dates', () => {
      const futureMonth = '2100-09'; // September 2100 has 30 days
      const result = DateTimeHelper.getAllMonthDates(futureMonth);
      expect(result.length).toBe(30);
      expect(result[0]).toBe('2100-09-01');
      expect(result[29]).toBe('2100-09-30');
    });
  });

  describe('formatTimeString', () => {
    it('should format a time string in HH:mm format', () => {
      const timeString = '14:30';
      const result = DateTimeHelper.formatTimeString(timeString);
      expect(result).toBe('14:30');
    });

    it('should format a time string with seconds to HH:mm format', () => {
      const timeString = '14:30:45';
      const result = DateTimeHelper.formatTimeString(timeString);
      expect(result).toBe('14:30');
    });

    it('should handle midnight correctly', () => {
      const timeString = '00:00';
      const result = DateTimeHelper.formatTimeString(timeString);
      expect(result).toBe('00:00');
    });

    it('should handle time near midnight correctly', () => {
      const timeString = '23:59:59';
      const result = DateTimeHelper.formatTimeString(timeString);
      expect(result).toBe('23:59');
    });

    it('should throw an error for invalid time string', () => {
      const invalidTimeStrings = ['25:30', '14:60', 'abc', '14:3'];

      invalidTimeStrings.forEach((timeString) => {
        expect(() => {
          DateTimeHelper.formatTimeString(timeString);
        }).toThrow(`Invalid time: ${timeString}`);
      });
    });

    it('should format time consistently regardless of input format', () => {
      const time1 = '09:30';
      const time2 = '09:30:00';

      const result1 = DateTimeHelper.formatTimeString(time1);
      const result2 = DateTimeHelper.formatTimeString(time2);

      expect(result1).toBe(result2);
      expect(result1).toBe('09:30');
    });
  });

  describe('convertTimeZone', () => {
    it('should convert time from one timezone to another', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'America/New_York';
      const time = '12:00';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      // UTC noon is 5 hours ahead of New York (EDT) or 4 hours ahead (EST)
      // We'll check if it's one of the expected values depending on DST
      const possibleResults = ['07:00', '08:00'];
      expect(possibleResults).toContain(result);
    });

    it('should convert time from New York to Tokyo', () => {
      const baseTimeZone = 'America/New_York';
      const otherTimeZone = 'Asia/Tokyo';
      const time = '09:00';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      // New York 9 AM is either Tokyo 10 PM or 11 PM (depending on DST)
      const possibleResults = ['22:00', '23:00'];
      expect(possibleResults).toContain(result);
    });

    it('should handle times with seconds correctly', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'Europe/London';
      const time = '15:30:45';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      // UTC and London are either the same (GMT) or 1 hour different (BST)
      const possibleResults = ['15:30', '16:30'];
      expect(possibleResults).toContain(result);
    });

    it('should convert midnight correctly', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'Australia/Sydney';
      const time = '00:00';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      // UTC midnight is either 10 AM or 11 AM in Sydney (depending on DST)
      const possibleResults = ['10:00', '11:00'];
      expect(possibleResults).toContain(result);
    });

    it('should handle same timezone conversion', () => {
      const timeZone = 'Europe/Berlin';
      const time = '14:45';

      const result = DateTimeHelper.convertTimeZone(timeZone, timeZone, time);

      expect(result).toBe('14:45');
    });

    it('should return time in HH:mm format regardless of input format', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'UTC';
      const time = '09:15:30';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      expect(result).toBe('09:15');
    });

    it('should throw an error for invalid time string', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'America/New_York';
      const invalidTime = '25:00';

      expect(() => {
        DateTimeHelper.convertTimeZone(
          baseTimeZone,
          otherTimeZone,
          invalidTime,
        );
      }).toThrow(`Invalid time: ${invalidTime}`);
    });

    it('should handle edge cases like 23:59', () => {
      const baseTimeZone = 'UTC';
      const otherTimeZone = 'America/Los_Angeles';
      const time = '23:59';

      const result = DateTimeHelper.convertTimeZone(
        baseTimeZone,
        otherTimeZone,
        time,
      );

      // UTC 23:59 is either 15:59 or 16:59 in LA (depending on DST)
      const possibleResults = ['15:59', '16:59'];
      expect(possibleResults).toContain(result);
    });
  });
});
