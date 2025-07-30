import { NotFoundException } from '@nestjs/common';

export class ScheduleNotFoundException extends NotFoundException {
  constructor(scheduleId: number) {
    super(`Schedule with ID ${scheduleId} not found.`);
  }
}
