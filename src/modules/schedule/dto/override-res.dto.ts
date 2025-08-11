import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

import { DateOverride } from '@/database/entities/date-override.entity';

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

  static fromEntity(dateOverride: DateOverride): DateOverrideResDto {
    return plainToInstance(DateOverrideResDto, dateOverride, {
      excludeExtraneousValues: true,
    });
  }
}
