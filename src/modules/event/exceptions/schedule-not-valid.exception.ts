import { BadRequestException } from '@nestjs/common';

export class ScheduleNotValidException extends BadRequestException {
  constructor(scheduleId: number) {
    super(`Schedule with ID ${scheduleId} is not valid`);
  }
}
