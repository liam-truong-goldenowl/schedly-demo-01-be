import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
  IsTimeZone,
  IsDateString,
  ValidateNested,
} from 'class-validator';

import { IsTime } from '@/common/validators/is-time.validator';
import { IsTodayOrLater } from '@/common/validators/is-today-or-later.validator';

class Invitee {
  @IsString()
  @ApiProperty({ example: 'Jane Smith' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'jane.smith@example.com' })
  email: string;
}

export class CreateBookingDto {
  @IsArray()
  @Type(() => Invitee)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Invitee] })
  invitees: Invitee[];

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
