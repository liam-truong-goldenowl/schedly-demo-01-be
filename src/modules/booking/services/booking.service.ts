import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Event } from '@/modules/event/entities/event.entity';

@Injectable()
export class BookingService {
  constructor(private em: EntityManager) {}

  async isValidStartTime({
    // eventId,
    date,
    // startTime,
  }: {
    eventId: number;
    date: string;
    startTime: string;
  }): Promise<boolean> {
    // const event = await this.em.findOneOrFail(
    //   Event,
    //   { id: eventId },
    //   { populate: ['schedule'] },
    // );

    // const schedule = await event.schedule.populate(['weeklyHours']);

    const dt = DateTime.fromISO(date, { zone: 'utc' });
    console.debug(dt.weekdayLong);

    return true; // Placeholder return value
  }
}
