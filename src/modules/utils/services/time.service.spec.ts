import { DateTime } from 'luxon';

import { Weekday } from '@/common/enums';

import { TimeService } from './time.service';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    service = new TimeService();
  });

  describe('timeRangesOverlap', () => {
    it('should return true when time ranges overlap', () => {
      expect(
        service.timeRangesOverlap(
          { startTime: '09:00', endTime: '11:00' },
          { startTime: '10:00', endTime: '12:00' },
        ),
      ).toBe(true);
    });

    it('should return false when time ranges do not overlap', () => {
      expect(
        service.timeRangesOverlap(
          { startTime: '09:00', endTime: '11:00' },
          { startTime: '11:00', endTime: '12:00' },
        ),
      ).toBe(false);
    });
  });

  describe('getWeekdayEnum', () => {
    it('should return correct weekday enum for a given date', () => {
      // Mock date that is a Monday
      jest
        .spyOn(DateTime, 'fromISO')
        .mockReturnValue({ weekdayLong: 'Monday', isValid: true } as any);

      expect(service.getWeekdayEnum('2023-08-07', 'UTC')).toBe(Weekday.MONDAY);
    });

    it('should throw error for invalid date', () => {
      jest
        .spyOn(DateTime, 'fromISO')
        .mockReturnValue({ isValid: false } as any);

      expect(() => service.getWeekdayEnum('invalid-date', 'UTC')).toThrow();
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to a time string', () => {
      jest.spyOn(DateTime.prototype, 'plus').mockReturnValue({
        toFormat: () => '10:30',
      } as any);

      expect(service.addMinutes('10:00', 30, 'UTC')).toBe('10:30');
    });
  });

  describe('formatTimeInZone', () => {
    it('should format time in the specified timezone', () => {
      jest.spyOn(DateTime.prototype, 'toFormat').mockReturnValue('10:00');

      expect(service.formatTimeInZone('10:00', 'UTC')).toBe('10:00');
    });
  });

  describe('generateIntervalStartTimes', () => {
    it('should generate correct interval start times', () => {
      // Mock implementation
      const mockDateTime = {
        toFormat: jest.fn().mockReturnValue('10:00'),
        plus: jest.fn().mockReturnValueOnce({
          toFormat: jest.fn().mockReturnValue('10:30'),
        } as any),
      };

      jest
        .spyOn(service as any, 'parseTimeString')
        .mockReturnValueOnce(mockDateTime as any)
        .mockReturnValueOnce({
          /* end time */
        } as any);

      // Mock comparison
      (mockDateTime as any).valueOf = jest.fn();
      (mockDateTime as any).valueOf.mockReturnValueOnce(1);
      (
        ({
          /* end time */
        }) as any
      ).valueOf = jest.fn().mockReturnValue(2);

      const result = service.generateIntervalStartTimes(
        '10:00',
        '11:00',
        30,
        'UTC',
      );
      expect(result).toEqual(['10:00']);
    });
  });

  describe('getMonthStartDate and getMonthEndDate', () => {
    it('should return first date of the month', () => {
      const mockStartOf = {
        toISODate: jest.fn().mockReturnValue('2023-08-01'),
      };

      jest.spyOn(service as any, 'parseMonthString').mockReturnValue({
        startOf: jest.fn().mockReturnValue(mockStartOf),
      } as any);

      expect(service.getMonthStartDate('2023-08', 'UTC')).toBe('2023-08-01');
    });

    it('should return last date of the month', () => {
      const mockEndOf = {
        toISODate: jest.fn().mockReturnValue('2023-08-31'),
      };

      jest.spyOn(service as any, 'parseMonthString').mockReturnValue({
        endOf: jest.fn().mockReturnValue(mockEndOf),
      } as any);

      expect(service.getMonthEndDate('2023-08', 'UTC')).toBe('2023-08-31');
    });
  });

  describe('getMonthDatesByWeekday', () => {
    it('should return all dates in month matching weekday', () => {
      const mockStartOf = {
        endOf: jest
          .fn()
          .mockReturnValue({ valueOf: jest.fn().mockReturnValue(100) }),
        valueOf: jest.fn().mockReturnValue(1),
        weekdayLong: 'Monday',
        toISODate: jest.fn().mockReturnValue('2023-08-07'),
        plus: jest.fn().mockReturnValue({
          valueOf: jest.fn().mockReturnValue(200),
        }),
      };

      jest.spyOn(service as any, 'parseMonthString').mockReturnValue({
        startOf: jest.fn().mockReturnValue(mockStartOf),
      } as any);

      const result = service.getMonthDatesByWeekday(
        '2023-08',
        Weekday.MONDAY,
        'UTC',
      );
      expect(result).toEqual(['2023-08-07']);
    });
  });

  describe('formatDateString', () => {
    it('should format date string correctly', () => {
      jest.spyOn(DateTime, 'fromISO').mockReturnValue({
        toFormat: jest.fn().mockReturnValue('2023-08-07'),
      } as any);

      expect(service.formatDateString('2023-08-07')).toBe('2023-08-07');
    });

    it('should format Date object correctly', () => {
      jest.spyOn(DateTime, 'fromJSDate').mockReturnValue({
        toFormat: jest.fn().mockReturnValue('2023-08-07'),
      } as any);

      expect(service.formatDateString(new Date())).toBe('2023-08-07');
    });
  });

  describe('formatTimeString', () => {
    it('should format time string correctly', () => {
      jest.spyOn(service as any, 'parseTimeString').mockReturnValue({
        toFormat: jest.fn().mockReturnValue('10:00'),
      } as any);

      expect(service.formatTimeString('10:00')).toBe('10:00');
    });
  });

  describe('generateSlots', () => {
    it('should generate time slots', () => {
      const mockStart = {
        plus: jest.fn().mockReturnValue({
          day: 1,
          valueOf: jest.fn().mockReturnValue(2),
        }),
        day: 1,
        valueOf: jest.fn().mockReturnValue(1),
        toFormat: jest.fn().mockReturnValue('10:00'),
      };

      const mockEnd = {
        valueOf: jest.fn().mockReturnValue(3),
      };

      jest
        .spyOn(service as any, 'parseTimeString')
        .mockReturnValueOnce(mockStart as any)
        .mockReturnValueOnce(mockEnd as any);

      const result = service.generateSlots('10:00', '11:00', 30);
      expect(result).toEqual(['10:00']);
    });
  });

  describe('convertTimeZone', () => {
    it('should convert time between time zones', () => {
      const mockSetZone = {
        toFormat: jest.fn().mockReturnValue('05:00'),
      };

      jest.spyOn(service as any, 'parseTimeString').mockReturnValue({
        setZone: jest.fn().mockReturnValue(mockSetZone),
      } as any);

      expect(service.convertTimeZone('UTC', 'America/New_York', '10:00')).toBe(
        '05:00',
      );
    });
  });

  describe('splitDateRangeAcrossZones', () => {
    it('should handle same date scenario', () => {
      jest.spyOn(DateTime, 'fromISO').mockImplementation((iso) => {
        if (iso === '2023-08-07T10:00') {
          return {
            isValid: true,
            setZone: jest.fn().mockReturnValue({
              isValid: true,
              toISODate: jest.fn().mockReturnValue('2023-08-07'),
              toFormat: jest.fn().mockReturnValue('10:00'),
            }),
          } as any;
        } else {
          return {
            isValid: true,
            setZone: jest.fn().mockReturnValue({
              isValid: true,
              toISODate: jest.fn().mockReturnValue('2023-08-07'),
              toFormat: jest.fn().mockReturnValue('11:00'),
            }),
          } as any;
        }
      });

      const result = service.splitDateRangeAcrossZones(
        'UTC',
        'America/New_York',
        '2023-08-07',
        '10:00',
        '11:00',
      );

      expect(result).toEqual([
        {
          date: '2023-08-07',
          startTime: '10:00',
          endTime: '10:00',
        },
      ]);
    });
  });
});
