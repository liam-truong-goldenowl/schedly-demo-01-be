import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, ForbiddenException } from '@nestjs/common';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';
import { ScheduleNotFoundException } from '@/modules/schedule/exceptions/schedule-not-found.exception';

import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateEventResDto } from '../dto/create-event-res.dto';

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
    });

    if (!referencedSchedule) {
      throw new ScheduleNotFoundException(body.scheduleId);
    }

    if (referencedSchedule.user.id !== userId) {
      throw new ForbiddenException();
    }

    const event = this.em.create(Event, {
      user: userId,
      schedule: body.scheduleId,
      ...body,
    });

    await this.em.flush();

    return CreateEventResDto.fromEntity(event);
  }
}
