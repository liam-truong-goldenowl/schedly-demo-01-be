import {
  IsInt,
  IsEnum,
  IsString,
  MaxLength,
  IsPositive,
  IsOptional,
} from 'class-validator';

import { EventType, LocationType } from '@/common/enums';

export class CreateEventDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsEnum(EventType)
  type: EventType;

  @IsString()
  locationDetails: string;

  @IsEnum(LocationType)
  locationType: LocationType;

  @IsInt()
  @IsPositive()
  @IsOptional()
  inviteeLimit: number;

  @IsInt()
  scheduleId: number;
}
