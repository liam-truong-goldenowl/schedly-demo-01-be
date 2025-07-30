import { IsNotEmpty, IsTimeZone } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  name: string;

  @IsTimeZone()
  timezone: string;
}
