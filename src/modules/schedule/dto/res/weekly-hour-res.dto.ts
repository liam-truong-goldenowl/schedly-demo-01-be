import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Weekday } from '@/common/enums';

export class WeeklyHourResDto {
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
}
