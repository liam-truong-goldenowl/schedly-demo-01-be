import { plainToInstance } from 'class-transformer';

import { WeeklyHour } from '../entities/weekly-hour.entity';
import { WeeklyHourResDto } from '../dto/res/weekly-hour-res.dto';

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
