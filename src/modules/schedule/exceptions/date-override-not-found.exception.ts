import { NotFoundException } from '@nestjs/common';

export class DateOverrideNotFoundException extends NotFoundException {
  constructor(scheduleDateOverrideId: number) {
    super(
      `Schedule Date Override with ID ${scheduleDateOverrideId} not found.`,
    );
  }
}
