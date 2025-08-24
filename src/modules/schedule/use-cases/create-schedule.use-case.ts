import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Schedule } from '../entities/schedule.entity';
import { WeeklyHour } from '../entities/weekly-hour.entity';
import { ScheduleMapper } from '../mappers/schedule.mapper';
import { CreateScheduleDto } from '../dto/req/create-schedule.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { WeeklyHourRepository } from '../repositories/weekly-hour.repository';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async execute(userId: number, data: CreateScheduleDto) {
    const schedule = await this.scheduleRepo.createEntity({
      user: userId,
      ...data,
    });
    await this.weeklyHourRepo.createDefaultEntities(schedule.id);
    return ScheduleMapper.toResponse(schedule);
  }
}
