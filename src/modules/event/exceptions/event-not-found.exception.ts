import { NotFoundException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor(eventId: number) {
    super(`Event with ID ${eventId} not found`);
  }
}
