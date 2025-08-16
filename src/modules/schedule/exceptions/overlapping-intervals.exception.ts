import { BadRequestException } from '@nestjs/common';

export class OverlappingIntervalsException extends BadRequestException {
  constructor() {
    super(`Overlapping intervals detected`);
  }
}
