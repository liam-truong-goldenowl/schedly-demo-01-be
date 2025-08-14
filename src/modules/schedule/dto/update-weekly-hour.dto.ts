import { OmitType } from '@nestjs/swagger';

import { CreateWeeklyHourDto } from './create-weekly-hour.dto';

export class UpdateWeeklyHourDto extends OmitType(CreateWeeklyHourDto, [
  'weekday',
]) {}
