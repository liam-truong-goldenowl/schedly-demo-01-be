import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ListEventsQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
  })
  cursor?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    type: Number,
    default: 5,
  })
  limit: number = 5;
}
