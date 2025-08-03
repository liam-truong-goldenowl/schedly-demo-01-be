import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, ArrayNotEmpty } from 'class-validator';

import { IntervalDto } from '@/common/dto/interval.dto';

export class CreateDateOverrideDto {
  @IsDateString()
  @ApiProperty({
    type: String,
    format: 'date',
  })
  date: string;

  @ArrayNotEmpty()
  @ApiProperty({
    type: [IntervalDto],
  })
  intervals: IntervalDto[];
}
