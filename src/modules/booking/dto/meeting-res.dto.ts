import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MeetingResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: '2023-10-01' })
  startDate: string;

  @Expose()
  @ApiProperty({ example: '14:30:00' })
  startTime: string;

  @Expose()
  @ApiProperty({ example: 'America/New_York' })
  timezone: string;

  @Expose()
  @ApiProperty({ example: 'Please arrive 15 minutes early.', required: false })
  note?: string;
}
