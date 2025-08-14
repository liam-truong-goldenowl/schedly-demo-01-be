import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { FilterQuery, EntityManager } from '@mikro-orm/core';

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
    const filters: FilterQuery<Meeting> = {
      event: {
        user: input.userId,
      },
    };

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
        const start = DateTime.fromISO(input.startDate!).toISODate();
        const end = DateTime.fromISO(input.endDate!).toISODate();
        filters.startDate = { $gte: start, $lt: end };
        break;
      }
    }

    const meetings = await this.em.find(Meeting, filters, {
      populate: ['event', 'invitees'],
    });

    return MeetingMapper.toResponseList(meetings);
  }
}

interface Input extends ListMeetingsQueryDto {
  userId: number;
}
