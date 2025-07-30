import { ApiProperty } from '@nestjs/swagger';

import { Weekday } from '@/common/enums';
import { IsTime } from '@/common/validators/is-time.validator';
import { IsWeekday } from '@/common/validators/is-weekday.validator';
import { IsBefore } from '@/common/validators/is-start-before-end.validator';

export class CreateWeeklyHourDto {
  @IsWeekday()
  @ApiProperty({ enum: Weekday, example: Weekday.MONDAY })
  weekday: Weekday;

  @IsTime()
  @IsBefore('endTime')
  @ApiProperty({ example: '09:00' })
  startTime: string;

  @IsTime()
  @ApiProperty({ example: '17:00' })
  endTime: string;
}
