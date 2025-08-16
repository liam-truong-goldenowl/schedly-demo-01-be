import { BadRequestException } from '@nestjs/common';

export class OverlappingHoursException extends BadRequestException {
  constructor() {
    super('Overlapping hours detected');
  }
}
