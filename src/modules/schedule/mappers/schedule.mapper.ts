import { plainToInstance } from 'class-transformer';

import { Schedule } from '@/database/entities';

import { ScheduleResDto } from '../dto';

export class ScheduleMapper {
  static toResponse(schedule: Schedule): ScheduleResDto {
    return plainToInstance(
      ScheduleResDto,
      {
        ...schedule,
        dateOverrides: schedule.dateOverrides.getItems(),
        weeklyHours: schedule.weeklyHours.getItems(),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  static toResponseList(schedules: Schedule[]): ScheduleResDto[] {
    return schedules.map((schedule) => this.toResponse(schedule));
  }
}
