import { plainToInstance } from 'class-transformer';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleResDto } from '../dto/res/schedule-res.dto';

export class ScheduleMapper {
  static toResponse(entity: Schedule): ScheduleResDto {
    return plainToInstance(
      ScheduleResDto,
      {
        ...entity,
        dateOverrides: entity.dateOverrides.getItems(),
        weeklyHours: entity.weeklyHours.getItems(),
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
