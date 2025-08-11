import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, ArrayNotEmpty } from 'class-validator';

import { HasIntervalDto } from '@/common/dto/interval.dto';

export class CreateDateOverrideDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @ApiProperty({
    type: [String],
    format: 'date',
  })
  dates: string[];

  @IsArray()
  @ApiProperty({
    type: [HasIntervalDto],
  })
  intervals: HasIntervalDto[];
}
