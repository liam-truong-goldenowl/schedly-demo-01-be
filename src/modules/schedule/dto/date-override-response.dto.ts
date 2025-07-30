import { Expose, plainToInstance } from 'class-transformer';

import { ScheduleDateOverride } from '../entities/schedule-date-override.entity';

export class ScheduleDateOverrideResponseDto {
  @Expose()
  id: number;

  @Expose()
  date: Date;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;

  static fromEntity(
    dateOverride: ScheduleDateOverride,
  ): ScheduleDateOverrideResponseDto {
    return plainToInstance(ScheduleDateOverrideResponseDto, dateOverride, {
      excludeExtraneousValues: true,
    });
  }
}
