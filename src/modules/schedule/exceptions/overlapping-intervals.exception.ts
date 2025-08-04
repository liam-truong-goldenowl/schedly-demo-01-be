import { BadRequestException } from '@nestjs/common';

import { IInterval } from '@/common/interfaces';

export class OverlappingIntervalsException extends BadRequestException {
  constructor(interval1: IInterval, interval2: IInterval) {
    super(`Overlapping intervals detected:
      Interval 1: ${interval1.startTime} - ${interval1.endTime}
      Interval 2: ${interval2.startTime} - ${interval2.endTime}`);
  }
}
