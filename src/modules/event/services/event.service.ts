import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { generateSlug } from '@/utils/helpers/strings';
import { UUIDService } from '@/modules/uuid/uuid.service';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { ListEventResDto } from '../dto/list-event-res.dto';
import { CreateEventResDto } from '../dto/create-event-res.dto';
import { ScheduleNotValidException } from '../exceptions/schedule-not-valid.exception';

@Injectable()
export class EventService {
  constructor(
    private em: EntityManager,
    private uuidService: UUIDService,
  ) {}

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

    const slug = await this.generateUniqueSlugForUser({
      name: body.name,
      userId,
    });

    const event = this.em.create(Event, {
      slug,
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

  private async generateUniqueSlugForUser({
    name,
    userId,
  }: {
    name: string;
    userId: number;
  }): Promise<string> {
    const baseSlug = generateSlug(name);
    let candidateSlug = baseSlug;

    const slugExists = await this.em.count(Event, {
      user: userId,
      slug: candidateSlug,
    });

    if (slugExists > 0) {
      const suffix = await this.uuidService.generate();
      candidateSlug = `${baseSlug}-${suffix}`;
    }

    return candidateSlug;
  }
}
