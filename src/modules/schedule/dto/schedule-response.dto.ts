import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, plainToInstance } from 'class-transformer';

import { Weekday } from '@/common/enums';

import { Schedule } from '../entities/schedule.entity';

import { ScheduleDateOverrideResponseDto } from './date-override-response.dto';
import { ScheduleWeeklyHourResponseDto } from './schedule-weekly-hour-response.dto';

export class ScheduleResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ example: 'My Schedule' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Asia/SaiGon' })
  timezone: string;

  @Expose()
  @ApiProperty({ example: true })
  isDefault: boolean;

  @Expose()
  @Type(() => ScheduleWeeklyHourResponseDto)
  @ApiProperty({
    type: [ScheduleWeeklyHourResponseDto],
    example: [
      {
        id: 1,
        day: Weekday.MONDAY,
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        id: 2,
        day: Weekday.TUESDAY,
        startTime: '09:00',
        endTime: '17:00',
      },
    ],
  })
  weeklyHours: ScheduleWeeklyHourResponseDto[];

  @Expose()
  @Type(() => ScheduleDateOverrideResponseDto)
  @ApiProperty({
    type: [ScheduleDateOverrideResponseDto],
    example: [
      {
        id: 1,
        date: new Date('2023-10-01'),
        startTime: '10:00',
        endTime: '16:00',
      },
      {
        id: 2,
        date: new Date('2023-10-02'),
        startTime: '11:00',
        endTime: '15:00',
      },
    ],
  })
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
