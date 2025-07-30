import { Expose } from 'class-transformer';

import { Weekday } from '@/common/enums';

export class ScheduleWeeklyHourDto {
  @Expose()
  id: number;

  @Expose()
  weekday: Weekday;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;
}
