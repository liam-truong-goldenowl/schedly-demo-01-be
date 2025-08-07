import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { ListEventResDto } from '../dto/list-event-res.dto';
import { CreateEventResDto } from '../dto/create-event-res.dto';
import { ScheduleNotValidException } from '../exceptions/schedule-not-valid.exception';

@Injectable()
export class EventService {
  constructor(private em: EntityManager) {}

  async createEvent({
    userId,
    body,
  }: {
    userId: number;
    body: CreateEventDto;
  }) {
    const referencedSchedule = await this.em.findOne(Schedule, {
      id: body.scheduleId,
      user: userId,
    });

    if (!referencedSchedule) {
      throw new ScheduleNotValidException(body.scheduleId);
    }

    const event = this.em.create(Event, {
      user: userId,
      schedule: body.scheduleId,
      ...body,
    });

    await this.em.flush();

    return CreateEventResDto.fromEntity(event);
  }

  async findAllEvents({
    limit,
    cursor,
    userId,
  }: {
    limit: number;
    cursor?: string;
    userId: number;
  }) {
    const currentCursor = await this.em.findByCursor(
      Event,
      { user: userId },
      {
        first: limit,
        after: cursor,
        orderBy: { createdAt: 'DESC' },
      },
    );

    return ListEventResDto.fromCursor(currentCursor);
  }

  async deleteEvent({ eventId }: { eventId: number }): Promise<void> {
    const event = await this.em.findOneOrFail(Event, { id: eventId });
    await this.em.removeAndFlush(event);
  }
}
