import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

import { IsTime } from '@/common/validators/is-time.validator';
import { IsBefore } from '@/common/validators/is-start-before-end.validator';

export class CreateDateOverrideDto {
  @IsDateString()
  @ApiProperty({
    type: String,
    format: 'date',
  })
  date: string;

  @IsTime()
  @IsBefore('endTime')
  @ApiProperty({ example: '09:00' })
  startTime: string;

  @IsTime()
  @ApiProperty({ example: '17:00' })
  endTime: string;
}
