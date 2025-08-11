import { plainToInstance } from 'class-transformer';

import { DateOverride } from '@/database/entities';

import { DateOverrideResDto } from '../dto';

export class DateOverrideMapper {
  static toResponse(dateOverride: DateOverride): DateOverrideResDto {
    return plainToInstance(DateOverrideResDto, dateOverride, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseList(dateOverrides: DateOverride[]): DateOverrideResDto[] {
    return dateOverrides.map((dateOverride) => this.toResponse(dateOverride));
  }
}
