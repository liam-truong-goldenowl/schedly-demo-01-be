import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, ArrayNotEmpty } from 'class-validator';

import { HasIntervalDto } from '@/common/dto/has-interval.dto';
import { IsTodayOrLater } from '@/common/validators/is-today-or-later.validator';

export class CreateDateOverrideDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @IsTodayOrLater({ each: true })
  @ApiProperty({ type: [String], format: 'date' })
  @Transform(({ value }) => value.map((date: string) => new Date(date)), {
    toClassOnly: true,
  })
  dates: Date[];

  @IsArray()
  @ApiProperty({
    type: [HasIntervalDto],
  })
  intervals: HasIntervalDto[];
}
