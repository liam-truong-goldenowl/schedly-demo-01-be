import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class BookingService {
  constructor(private em: EntityManager) {}

  async isValidStartTime({
    eventId,
    startTime,
  }: {
    eventId: number;
    startTime: string;
  }): Promise<boolean> {
    console.log(`Validating start time for event ${eventId} at ${startTime}`);
    return true; // Placeholder return value
  }
}
