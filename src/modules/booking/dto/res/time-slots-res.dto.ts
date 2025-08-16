import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';

export class TimeSlotResDto {
  @Expose()
  @ApiProperty({ example: '2023-10-01' })
  date: string;

  @Type(() => String)
  @Expose()
  @ApiProperty({ example: ['14:30:00', '15:00:00'] })
  slots: string[];
}
