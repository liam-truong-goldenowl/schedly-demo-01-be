import { Type, Expose, plainToInstance } from 'class-transformer';

import { Schedule } from '../entities/schedule.entity';

import { ScheduleWeeklyHourDto } from './schedule-weekly-hour.dto';

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
  @Type(() => ScheduleWeeklyHourDto)
  weeklyHours: ScheduleWeeklyHourDto[];

  static fromEntity(schedule: Schedule): ScheduleResponseDto {
    return plainToInstance(
      ScheduleResponseDto,
      { ...schedule, weeklyHours: schedule.weeklyHours.getItems() },
      { excludeExtraneousValues: true },
    );
  }
}
