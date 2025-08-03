import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, plainToInstance } from 'class-transformer';

import { Weekday } from '@/common/enums';

import { Schedule } from '../entities/schedule.entity';

import { ScheduleDateOverrideResDto } from './date-override-res.dto';
import { ScheduleWeeklyHourResDto } from './schedule-weekly-hour-res.dto';

export class ScheduleResDto {
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
  @Type(() => ScheduleWeeklyHourResDto)
  @ApiProperty({
    type: [ScheduleWeeklyHourResDto],
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
  weeklyHours: ScheduleWeeklyHourResDto[];

  @Expose()
  @Type(() => ScheduleDateOverrideResDto)
  @ApiProperty({
    type: [ScheduleDateOverrideResDto],
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
  dateOverrides: ScheduleDateOverrideResDto[];

  static fromEntity(schedule: Schedule): ScheduleResDto {
    return plainToInstance(
      ScheduleResDto,
      {
        ...schedule,
        weeklyHours: schedule.weeklyHours.getItems(),
        dateOverrides: schedule.dateOverrides.getItems(),
      },
      { excludeExtraneousValues: true },
    );
  }
}
