import { plainToInstance } from 'class-transformer';

import { WeeklyHour } from '@/database/entities';

import { WeeklyHourResDto } from '../dto';

export class WeeklyHourMapper {
  static toResponse(weeklyHour: WeeklyHour): WeeklyHourResDto {
    return plainToInstance(WeeklyHourResDto, weeklyHour, {
      excludeExtraneousValues: true,
    });
  }

  static toResponseList(weeklyHours: WeeklyHour[]): WeeklyHourResDto[] {
    return weeklyHours.map((hour) => this.toResponse(hour));
  }
}
