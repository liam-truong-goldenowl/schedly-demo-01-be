import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';

import { Period } from '../enums/period.enum';
import { MeetingMapper } from '../mappers/meeting.mapper';
import { MeetingRepository } from '../repositories/meeting.repository';
import { ListMeetingsQueryDto } from '../dto/req/list-meetings-query.dto';

@Injectable()
export class ListMeetingsUseCase {
  constructor(private readonly meetingRepo: MeetingRepository) {}

  async execute(userId: number, query: ListMeetingsQueryDto) {
    const filters: Record<string, any> = {
      event: { user: userId },
    };

    if (query.eventSlug) {
      filters.event.slug = query.eventSlug;
    }

    const today = DateTime.now().toISODate();

    const periodFilters: Record<Period, () => void> = {
      [Period.UPCOMING]: () => {
        filters.startDate = { $gte: today };
      },
      [Period.PAST]: () => {
        filters.startDate = { $lt: today };
      },
      [Period.FIXED]: () => {
        if (query.startDate && query.endDate) {
          filters.startDate = { $gte: query.startDate, $lt: query.endDate };
        }
      },
    };

    periodFilters[query.period]?.();

    const cursor = await this.meetingRepo.findByCursor(filters, {
      first: 10,
      after: undefined,
      orderBy: { createdAt: 'DESC' },
      populate: ['event', 'invitees'],
    });

    return MeetingMapper.toCursorPaginatedResponse(cursor);
  }
}
