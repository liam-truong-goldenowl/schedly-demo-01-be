import { NotFoundException } from '@nestjs/common';

export class WeeklyHourNotFoundException extends NotFoundException {
  constructor(scheduleWeeklyHourId: number) {
    super(
      `Schedule Weekly Hour block with ID ${scheduleWeeklyHourId} not found.`,
    );
  }
}
