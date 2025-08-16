import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/modules/user/repositories/user.repository';

import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    private scheduleRepo: ScheduleRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(userId: number, scheduleId: number) {
    const user = this.userRepo.getReference(userId);
    await this.scheduleRepo.deleteEntity({ id: scheduleId, user });
  }
}
