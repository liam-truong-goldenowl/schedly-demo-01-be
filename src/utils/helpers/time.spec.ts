import { isOverlapping } from './time';

describe('isOverlapping (object signature)', () => {
  it('should return true when intervals overlap', () => {
    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '11:00', end: '13:00' },
      }),
    ).toBe(true);

    expect(
      isOverlapping({
        duration1: { start: '09:00', end: '11:00' },
        duration2: { start: '10:00', end: '12:00' },
      }),
    ).toBe(true);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '10:30', end: '11:30' },
      }),
    ).toBe(true);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '09:00', end: '10:30' },
      }),
    ).toBe(true);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '11:59', end: '12:01' },
      }),
    ).toBe(true);
  });

  it('should return false when intervals do not overlap', () => {
    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '12:00', end: '13:00' },
      }),
    ).toBe(false);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '08:00', end: '10:00' },
      }),
    ).toBe(false);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '12:01', end: '13:00' },
      }),
    ).toBe(false);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '08:00', end: '09:59' },
      }),
    ).toBe(false);
  });

  it('should return false when intervals touch but do not overlap', () => {
    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '12:00', end: '14:00' },
      }),
    ).toBe(false);

    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '08:00', end: '10:00' },
      }),
    ).toBe(false);
  });

  it('should return true when intervals are exactly the same', () => {
    expect(
      isOverlapping({
        duration1: { start: '10:00', end: '12:00' },
        duration2: { start: '10:00', end: '12:00' },
      }),
    ).toBe(true);
  });
});
