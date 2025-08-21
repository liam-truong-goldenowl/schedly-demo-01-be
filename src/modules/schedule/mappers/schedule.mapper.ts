import { plainToInstance } from 'class-transformer';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleResDto } from '../dto/res/schedule-res.dto';

import { WeeklyHourMapper } from './weekly-hour.mapper';
import { DateOverrideMapper } from './date-override.mapper';

export class ScheduleMapper {
  static toResponse(entity: Schedule): ScheduleResDto {
    return plainToInstance(
      ScheduleResDto,
      {
        ...entity,
        dateOverrides: DateOverrideMapper.toResponseList(
          entity.dateOverrides.getItems(),
        ),
        weeklyHours: WeeklyHourMapper.toResponseList(
          entity.weeklyHours.getItems(),
        ),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  static toResponseList(entities: Schedule[]): ScheduleResDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
