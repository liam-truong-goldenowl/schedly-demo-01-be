import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString } from 'class-validator';

import { IntervalDto } from '@/common/dto/interval.dto';
import { IsTodayOrLater } from '@/common/validators/is-today-or-later.validator';

export class CreateDateOverrideDto {
  @IsArray()
  @IsTodayOrLater({ each: true })
  @IsDateString({}, { each: true })
  @ApiProperty({ type: [String], format: 'date' })
  dates: string[];

  @IsArray()
  @ApiProperty({
    type: [IntervalDto],
  })
  intervals: IntervalDto[];
}
