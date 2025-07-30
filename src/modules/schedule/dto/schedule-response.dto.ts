import { Type, Expose, plainToInstance } from 'class-transformer';

import { Schedule } from '../entities/schedule.entity';

import { ScheduleDateOverrideResponseDto } from './date-override-response.dto';
import { ScheduleWeeklyHourResponseDto } from './schedule-weekly-hour-response.dto';

export class ScheduleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  timezone: string;

  @Expose()
  isDefault: boolean;

  @Expose()
  @Type(() => ScheduleWeeklyHourResponseDto)
  weeklyHours: ScheduleWeeklyHourResponseDto[];

  @Expose()
  @Type(() => ScheduleDateOverrideResponseDto)
  dateOverrides: ScheduleDateOverrideResponseDto[];

  static fromEntity(schedule: Schedule): ScheduleResponseDto {
    return plainToInstance(
      ScheduleResponseDto,
      {
        ...schedule,
        weeklyHours: schedule.weeklyHours.getItems(),
        dateOverrides: schedule.dateOverrides.getItems(),
      },
      { excludeExtraneousValues: true },
    );
  }
}
