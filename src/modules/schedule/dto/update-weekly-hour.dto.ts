import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateWeeklyHourDto } from './create-weekly-hour.dto';

export class UpdateWeeklyHourDto extends PartialType(
  OmitType(CreateWeeklyHourDto, ['weekday']),
) {}
