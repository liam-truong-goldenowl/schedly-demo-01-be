import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

import { Weekday } from '@/common/enums';

import { ScheduleWeeklyHour } from '../entities/schedule-weekly-hour.entity';

export class ScheduleWeeklyHourResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: Weekday.MONDAY, enum: Weekday })
  weekday: Weekday;

  @Expose()
  @ApiProperty({ example: '09:00' })
  startTime: string;

  @Expose()
  @ApiProperty({ example: '17:00' })
  endTime: string;

  static fromEntity(
    weeklyHour: ScheduleWeeklyHour,
  ): ScheduleWeeklyHourResponseDto {
    return plainToInstance(ScheduleWeeklyHourResponseDto, weeklyHour, {
      excludeExtraneousValues: true,
    });
  }
}
