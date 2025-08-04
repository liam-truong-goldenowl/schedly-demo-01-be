import { Expose, plainToInstance } from 'class-transformer';

import { EventType, LocationType } from '@/common/enums';

import { Event } from '../entities/event.entity';

export class CreateEventResDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  duration: number;

  @Expose()
  type: EventType;

  @Expose()
  locationType: LocationType;

  @Expose()
  locationDetails: string;

  @Expose()
  inviteeLimit: number;

  @Expose()
  scheduleId: number;

  static fromEntity(entity: Event): CreateEventResDto {
    return plainToInstance(
      CreateEventResDto,
      { ...entity, scheduleId: entity.schedule.id },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
