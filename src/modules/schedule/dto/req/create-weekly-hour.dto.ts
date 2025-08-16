import { ApiProperty } from '@nestjs/swagger';

import { Weekday } from '@/common/enums';
import { HasIntervalDto } from '@/common/dto/has-interval.dto';
import { IsWeekday } from '@/common/validators/is-weekday.validator';

export class CreateWeeklyHourDto extends HasIntervalDto {
  @IsWeekday()
  @ApiProperty({ enum: Weekday, example: Weekday.MONDAY })
  weekday: Weekday;
}
