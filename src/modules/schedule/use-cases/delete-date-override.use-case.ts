import { Injectable } from '@nestjs/common';

import { DateOverrideRepository } from '../repositories/date-override.repository';

@Injectable()
export class DeleteDateOverrideUseCase {
  constructor(private readonly dateOverrideRepo: DateOverrideRepository) {}

  async execute(scheduleId: number, dateOverrideId: number) {
    await this.dateOverrideRepo.deleteEntity({
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });
  }
}
