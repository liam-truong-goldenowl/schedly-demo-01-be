import { IsTimeZone, IsNumberString } from 'class-validator';

import { IsYearMonth } from '@/common/validators';

export class ListAvailableTimeSlotsQueryDto {
  @IsNumberString()
  eventId: number;

  @IsYearMonth()
  month: string;

  @IsTimeZone()
  timezone: string;
}
