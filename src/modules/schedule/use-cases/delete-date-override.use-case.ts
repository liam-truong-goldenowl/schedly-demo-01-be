import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { DateOverride } from '../entities/date-override.entity';
import { DateOverrideRepository } from '../repositories/date-override.repository';

@Injectable()
export class DeleteDateOverrideUseCase {
  constructor(
    @InjectRepository(DateOverride)
    private readonly dateOverrideRepo: DateOverrideRepository,
  ) {}

  async execute(scheduleId: number, dateOverrideId: number) {
    await this.dateOverrideRepo.deleteEntity({
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });
  }
}
