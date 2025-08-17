import { Expose } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

export class MeetingResDto {
  @Expose()
  @ApiResponseProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiResponseProperty({ example: '2023-10-01' })
  startDate: string;

  @Expose()
  @ApiResponseProperty({ example: '14:30:00' })
  startTime: string;

  @Expose()
  @ApiResponseProperty({ example: 'America/New_York' })
  timezone: string;

  @Expose()
  @ApiResponseProperty({
    example: 'Please arrive 15 minutes early.',
  })
  note?: string;
}
