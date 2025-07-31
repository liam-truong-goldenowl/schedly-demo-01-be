import { Interval } from '@/common/interfaces/interval.interface';

/**
 * Check if (newStart, newEnd) overlaps with (existingStart, existingEnd)
 */
export function isOverlapping(
  interval1: Interval,
  interval2: Interval,
): boolean {
  return (
    interval1.startTime < interval2.endTime &&
    interval2.startTime < interval1.endTime
  );
}
