import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

import { IntervalDto } from '@/common/dto/interval.dto';

export class CreateDateOverrideDto {
  @IsDateString()
  @ApiProperty({
    type: String,
    format: 'date',
  })
  date: string;

  @IsNotEmpty()
  @ApiProperty({
    type: [IntervalDto],
  })
  intervals: IntervalDto[];
}
