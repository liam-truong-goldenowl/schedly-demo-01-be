/**
 * Check if (newStart, newEnd) overlaps with (existingStart, existingEnd)
 */
export function isOverlapping({
  duration1,
  duration2,
}: {
  duration1: { start: string; end: string };
  duration2: { start: string; end: string };
}): boolean {
  return duration1.start < duration2.end && duration2.start < duration1.end;
}
