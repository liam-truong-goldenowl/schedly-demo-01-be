import { ApiProperty } from '@nestjs/swagger';

import { Weekday } from '@/common/enums';
import { IntervalDto } from '@/common/dto/interval.dto';
import { IsWeekday } from '@/common/validators/is-weekday.validator';

export class CreateWeeklyHourDto extends IntervalDto {
  @IsWeekday()
  @ApiProperty({ enum: Weekday, example: Weekday.MONDAY })
  weekday: Weekday;
}
