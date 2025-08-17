import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { DateOverride } from '../entities/date-override.entity';
import { DateOverrideMapper } from '../mappers/date-override.mapper';
import { UpdateDateOverrideDto } from '../dto/req/update-date-override.dto';
import { DateOverrideRepository } from '../repositories/date-override.repository';

@Injectable()
export class UpdateDateOverrideUseCase {
  constructor(
    @InjectRepository(DateOverride)
    private readonly dateOverrideRepo: DateOverrideRepository,
  ) {}

  async execute(
    scheduleId: number,
    dateOverrideId: number,
    dateOverrideData: UpdateDateOverrideDto,
  ) {
    const dateOverride = await this.dateOverrideRepo.updateEntity(
      { id: dateOverrideId, schedule: { id: scheduleId } },
      dateOverrideData,
    );
    return DateOverrideMapper.toResponse(dateOverride);
  }
}
