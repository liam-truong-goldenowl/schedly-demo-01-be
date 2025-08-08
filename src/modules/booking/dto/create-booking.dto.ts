import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  IsTimeZone,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { IsTime } from '@/common/validators/is-time.validator';
import { IsTodayOrLater } from '@/common/validators/is-today-or-later.validator';

export class CreateBookingDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsEmail({}, { each: true })
  guestEmails: string[];

  @IsNumber()
  eventId: number;

  @IsDateString()
  @IsTodayOrLater()
  startDate: string;

  @IsTime()
  startTime: string;

  @IsTimeZone()
  timezone: string;

  @IsString()
  @IsOptional()
  note?: string;
}
