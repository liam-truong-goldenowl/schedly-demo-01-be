import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsTimeZone } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'My Schedule' })
  name: string;

  @IsTimeZone()
  @ApiProperty({ example: 'America/New_York' })
  timezone: string;
}
