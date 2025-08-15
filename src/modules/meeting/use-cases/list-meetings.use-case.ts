import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Meeting } from '@/database/entities';

import { MeetingMapper } from '../mappers/meeting.mapper';
import {
  Period,
  ListMeetingsQueryDto,
} from '../dto/req/list-meetings-query.dto';

@Injectable()
export class ListMeetingsUseCase {
  constructor(private em: EntityManager) {}

  async execute(input: Input) {
    const filters: Record<string, any> = {
      event: {
        user: input.userId,
      },
    };

    if (input.eventSlug) {
      filters.event.slug = input.eventSlug;
    }

    switch (input.period) {
      case Period.UPCOMING: {
        const today = DateTime.fromISO(new Date().toISOString()).toISODate();
        filters.startDate = { $gte: today };
        break;
      }
      case Period.PAST: {
        const today = DateTime.fromISO(new Date().toISOString()).toISODate();
        filters.startDate = { $lt: today };
        break;
      }
      case Period.FIXED: {
        const doesNotHaveRange = !input.startDate || !input.endDate;
        if (doesNotHaveRange) break;
        const start = DateTime.fromISO(input.startDate!).toISODate();
        const end = DateTime.fromISO(input.endDate!).toISODate();
        filters.startDate = { $gte: start, $lt: end };
        break;
      }
    }

    const currentCursor = await this.em.findByCursor(Meeting, filters, {
      first: 10,
      after: undefined,
      orderBy: { createdAt: 'DESC' },
      populate: ['event', 'invitees'],
    });

    return MeetingMapper.toCursorPaginatedResponse(currentCursor);
  }
}

interface Input extends ListMeetingsQueryDto {
  userId: number;
}
