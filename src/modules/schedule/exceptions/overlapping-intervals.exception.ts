import { BadRequestException } from '@nestjs/common';

import { Interval } from '@/common/interfaces/interval.interface';

export class OverlappingIntervalsException extends BadRequestException {
  constructor(interval1: Interval, interval2: Interval) {
    super(`Overlapping intervals detected:
      Interval 1: ${interval1.startTime} - ${interval1.endTime}
      Interval 2: ${interval2.startTime} - ${interval2.endTime}`);
  }
}
