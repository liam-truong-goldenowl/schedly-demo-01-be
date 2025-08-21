import { ApiProperty } from '@nestjs/swagger';

import { IsTime } from '@/common/validators/is-time.validator';
import { IsBefore } from '@/common/validators/is-before.validator';

export class IntervalDto {
  @IsTime()
  @IsBefore('endTime')
  @ApiProperty({ example: '09:00' })
  startTime: string;

  @IsTime()
  @ApiProperty({ example: '17:00' })
  endTime: string;
}
