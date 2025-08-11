import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Schedule, WeeklyHour } from '@/database/entities';

import { CreateWeeklyHourDto } from '../dto';
import { WeeklyHourMapper } from '../mappers/weekly-hour.mapper';
import { WeeklyHourService } from '../services/weekly-hour.service';

@Injectable()
export class CreateWeeklyHourUseCase {
  constructor(
    private em: EntityManager,
    private weeklyHourService: WeeklyHourService,
  ) {}

  async execute({
    scheduleId,
    weeklyHourData,
  }: {
    scheduleId: number;
    weeklyHourData: CreateWeeklyHourDto;
  }) {
    await this.weeklyHourService.checkOverlapping({
      scheduleId,
      startTime: weeklyHourData.startTime,
      endTime: weeklyHourData.endTime,
      weekday: weeklyHourData.weekday,
    });

    const weeklyHour = this.em.create(WeeklyHour, {
      schedule: this.em.getReference(Schedule, scheduleId),
      weekday: weeklyHourData.weekday,
      endTime: weeklyHourData.endTime,
      startTime: weeklyHourData.startTime,
    });

    await this.em.flush();

    return WeeklyHourMapper.toResponse(weeklyHour);
  }
}
