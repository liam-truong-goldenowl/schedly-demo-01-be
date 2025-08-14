import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Team Meeting' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Discuss project updates and next steps',
    required: false,
  })
  description?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 60 })
  duration: number;

  @IsEnum(EventType)
  @ApiProperty({ enum: EventType, example: EventType.ONE_ON_ONE })
  type: EventType;

  @IsString()
  @ApiProperty({
    example: 'Conference Room A',
  })
  locationDetails: string;

  @IsEnum(LocationType)
  @ApiProperty({ enum: LocationType, example: LocationType.IN_PERSON })
  locationType: LocationType;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ example: 10, required: false })
  inviteeLimit: number;

  @IsInt()
  @ApiProperty({ example: 1 })
  scheduleId: number;
}
