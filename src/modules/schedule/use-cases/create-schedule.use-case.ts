import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserRepository } from '@/modules/user/repositories/user.repository';

import { ScheduleMapper } from '../mappers/schedule.mapper';
import { CreateScheduleDto } from '../dto/req/create-schedule.dto';
import { ScheduleCreatedEvent } from '../events/schedule-created.event';
import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userRepo: UserRepository,
    private readonly scheduleRepo: ScheduleRepository,
  ) {}

  async execute(userId: number, scheduleData: CreateScheduleDto) {
    const user = this.userRepo.getReference(userId);
    const schedule = await this.scheduleRepo.createEntity({
      user,
      ...scheduleData,
    });
    await this.eventEmitter.emitAsync(
      'schedule.created',
      new ScheduleCreatedEvent({ id: schedule.id }),
    );
    return ScheduleMapper.toResponse(schedule);
  }
}
