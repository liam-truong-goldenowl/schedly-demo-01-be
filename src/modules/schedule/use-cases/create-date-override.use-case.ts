import { Injectable } from '@nestjs/common';

import { DateOverrideMapper } from '../mappers/date-override.mapper';
import { DateOverrideService } from '../services/date-override.service';
import { CreateDateOverrideDto } from '../dto/req/create-date-override.dto';

@Injectable()
export class CreateDateOverrideUseCase {
  constructor(private dateOverrideService: DateOverrideService) {}

  async execute(
    scheduleId: number,
    { intervals, dates }: CreateDateOverrideDto,
  ) {
    await this.dateOverrideService.detectOverlappingIntervals(intervals);
    await this.dateOverrideService.removeExistingOverrides(scheduleId, dates);
    const newOverrides = await this.dateOverrideService.createDateOverrides(
      scheduleId,
      { dates, intervals },
    );
    return DateOverrideMapper.toResponseList(newOverrides);
  }
}
