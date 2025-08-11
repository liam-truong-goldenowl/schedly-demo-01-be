import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { DateOverride } from '@/database/entities';

import { UpdateDateOverrideDto } from '../dto';
import { DateOverrideMapper } from '../mappers';

@Injectable()
export class UpdateDateOverrideUseCase {
  constructor(private em: EntityManager) {}

  async execute({
    scheduleId,
    dateOverrideId,
    dateOverrideData,
  }: {
    scheduleId: number;
    dateOverrideId: number;
    dateOverrideData: UpdateDateOverrideDto;
  }) {
    const dateOverride = await this.em.findOneOrFail(DateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    this.em.assign(dateOverride, {
      startTime: dateOverrideData.startTime,
      endTime: dateOverrideData.endTime,
    });

    await this.em.flush();

    return DateOverrideMapper.toResponse(dateOverride);
  }
}
