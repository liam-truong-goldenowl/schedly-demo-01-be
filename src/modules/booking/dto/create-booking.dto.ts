import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @ApiProperty({ example: ['guest1@example.com', 'guest2@example.com'] })
  guestEmails: string[];

  @IsNumber()
  @ApiProperty({ example: 1 })
  eventId: number;

  @IsDateString()
  @IsTodayOrLater()
  @ApiProperty({ example: '2023-10-01' })
  startDate: string;

  @IsTime()
  @ApiProperty({ example: '14:30:00' })
  startTime: string;

  @IsTimeZone()
  @ApiProperty({ example: 'America/New_York' })
  timezone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Please arrive 15 minutes early.', required: false })
  note?: string;
}
