import { Expose, plainToInstance } from 'class-transformer';

import { Weekday } from '@/common/enums';

import { ScheduleWeeklyHour } from '../entities/schedule-weekly-hour.entity';

export class ScheduleWeeklyHourResponseDto {
  @Expose()
  id: number;

  @Expose()
  weekday: Weekday;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;

  static fromEntity(
    weeklyHour: ScheduleWeeklyHour,
  ): ScheduleWeeklyHourResponseDto {
    return plainToInstance(ScheduleWeeklyHourResponseDto, weeklyHour, {
      excludeExtraneousValues: true,
    });
  }
}
