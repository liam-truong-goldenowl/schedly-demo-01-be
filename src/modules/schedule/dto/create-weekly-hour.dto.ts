import { Weekday } from '@/common/enums';
import { IsTime } from '@/common/validators/is-time.validator';
import { IsWeekday } from '@/common/validators/is-weekday.validator';
import { IsBefore } from '@/common/validators/is-start-before-end.validator';

export class CreateWeeklyHourDto {
  @IsWeekday()
  weekday: Weekday;

  @IsTime()
  @IsBefore('endTime')
  startTime: string;

  @IsTime()
  endTime: string;
}
