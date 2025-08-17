import { Type, Expose } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

export class TimeSlotResDto {
  @Expose()
  @ApiResponseProperty({ example: '2023-10-01' })
  date: string;

  @Type(() => String)
  @Expose()
  @ApiResponseProperty({ example: ['14:30:00', '15:00:00'] })
  slots: string[];
}
