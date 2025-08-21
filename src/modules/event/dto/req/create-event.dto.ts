import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  MaxLength,
  IsOptional,
  IsPositive,
} from 'class-validator';

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

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty({ example: 10, required: false })
  inviteeLimit: number;

  @IsInt()
  @ApiProperty({ example: 1 })
  scheduleId: number;
}
