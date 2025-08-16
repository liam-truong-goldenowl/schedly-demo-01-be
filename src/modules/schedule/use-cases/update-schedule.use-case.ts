import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/modules/user/repositories/user.repository';

import { ScheduleMapper } from '../mappers/schedule.mapper';
import { UpdateScheduleDto } from '../dto/req/update-schedule.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class UpdateScheduleUseCase {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(
    userId: number,
    scheduleId: number,
    scheduleData: UpdateScheduleDto,
  ) {
    const user = this.userRepo.getReference(userId);
    const schedule = await this.scheduleRepo.updateEntity(
      { id: scheduleId, user },
      scheduleData,
    );
    await schedule.populate(['weeklyHours', 'dateOverrides']);
    return ScheduleMapper.toResponse(schedule);
  }
}
