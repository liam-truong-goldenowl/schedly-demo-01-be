import { IsDateString } from 'class-validator';

import { IsTime } from '@/common/validators/is-time.validator';
import { IsBefore } from '@/common/validators/is-start-before-end.validator';

export class CreateDateOverrideDto {
  @IsDateString()
  date: string;

  @IsTime()
  @IsBefore('endTime')
  startTime: string;

  @IsTime()
  endTime: string;
}
