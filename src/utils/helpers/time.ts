import { IInterval } from '@/common/interfaces';

/**
 * Determines whether two time intervals overlap.
 *
 * @param interval1 - The first interval with `startTime` and `endTime`.
 * @param interval2 - The second interval with `startTime` and `endTime`.
 * @returns `true` if the intervals overlap; otherwise, `false`.
 */
export function isOverlapping(
  interval1: IInterval,
  interval2: IInterval,
): boolean {
  return (
    interval1.startTime < interval2.endTime &&
    interval2.startTime < interval1.endTime
  );
}
