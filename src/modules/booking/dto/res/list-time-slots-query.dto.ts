import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

import { IsYearMonth } from '@/common/validators/is-year-month.validator';

export class ListTimeSlotsQueryDto {
  @IsNumberString()
  @ApiProperty({ example: 1 })
  eventId: number;

  @IsYearMonth()
  @ApiProperty({ example: '2023-10' })
  month: string;
}
