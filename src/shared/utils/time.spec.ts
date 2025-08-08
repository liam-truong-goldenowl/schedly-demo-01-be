import { isOverlapping } from './time';

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
