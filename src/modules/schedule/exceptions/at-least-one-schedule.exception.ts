import { BadRequestException } from '@nestjs/common';

export class AtLeastOneScheduleException extends BadRequestException {
  constructor() {
    super('At least one schedule must be existed for the user.');
  }
}
