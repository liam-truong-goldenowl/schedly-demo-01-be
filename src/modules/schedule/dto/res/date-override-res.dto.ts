import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DateOverrideResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: new Date() })
  date: Date;

  @Expose()
  @ApiProperty({ example: '10:00' })
  startTime: string;

  @Expose()
  @ApiProperty({ example: '16:00' })
  endTime: string;
}
