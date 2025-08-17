import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: ScheduleRepository,
    @InjectRepository(User)
    private userRepo: UserRepository,
  ) {}

  async execute(userId: number, scheduleId: number) {
    const user = this.userRepo.getReference(userId);
    await this.scheduleRepo.deleteEntity({ id: scheduleId, user });
  }
}
