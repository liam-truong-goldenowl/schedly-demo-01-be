import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Weekday } from '@/common/enums';
import { WeeklyHour } from '@/database/entities';

import { OverlappingHoursException } from '../exceptions';

@Injectable()
export class WeeklyHourService {
  constructor(private em: EntityManager) {}

  async checkOverlapping({
    scheduleId,
    startTime,
    endTime,
    weekday,
  }: {
    scheduleId: number;
    startTime: string;
    endTime: string;
    weekday: Weekday;
  }) {
    const overlappingHoursCount = await this.em.count(WeeklyHour, {
      weekday,
      schedule: { id: scheduleId },
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
    });

    if (overlappingHoursCount > 0) {
      throw new OverlappingHoursException({
        weekday,
        start: startTime,
        end: endTime,
      });
    }
  }
}
