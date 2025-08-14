import { Injectable } from '@nestjs/common';

import { CreateDateOverrideDto } from '../dto';
import { DateOverrideMapper } from '../mappers';
import { DateOverrideService } from '../services/date-override.service';

@Injectable()
export class CreateDateOverrideUseCase {
  constructor(private dateOverrideService: DateOverrideService) {}
  async execute({
    scheduleId,
    dateOverrideData,
  }: {
    scheduleId: number;
    dateOverrideData: CreateDateOverrideDto;
  }) {
    const { intervals, dates } = dateOverrideData;

    await this.dateOverrideService.checkOverlappingIntervals(intervals);
    await this.dateOverrideService.removeExistingOverrides(scheduleId, dates);

    const newOverrides =
      intervals.length > 0
        ? await this.dateOverrideService.createAvailableOverrides(scheduleId, {
            dates,
            intervals,
          })
        : await this.dateOverrideService.createUnavailableOverrides(
            scheduleId,
            dates,
          );

    return DateOverrideMapper.toResponseList(newOverrides);
  }
}
