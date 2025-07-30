import { Expose, plainToInstance } from 'class-transformer';

import { Weekday } from '@/common/enums';

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
    weeklyHour: ScheduleWeeklyHourResponseDto,
  ): ScheduleWeeklyHourResponseDto {
    return plainToInstance(ScheduleWeeklyHourResponseDto, weeklyHour, {
      excludeExtraneousValues: true,
    });
  }
}
