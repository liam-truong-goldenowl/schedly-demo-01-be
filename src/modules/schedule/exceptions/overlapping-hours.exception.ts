import { BadRequestException } from '@nestjs/common';

export class OverlappingHoursException extends BadRequestException {
  constructor(hours: { start: string; end: string; weekday: string }) {
    super(
      `Overlapping hours detected for "${hours.weekday}" from "${hours.start}" to "${hours.end}".`,
    );
  }
}
