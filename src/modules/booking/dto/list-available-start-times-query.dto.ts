import { IsTimeZone, IsDateString, IsNumberString } from 'class-validator';

export class ListAvailableStartTimesQueryDto {
  @IsNumberString()
  eventId: number;

  @IsDateString()
  date: string;

  @IsTimeZone()
  timezone: string;
}
