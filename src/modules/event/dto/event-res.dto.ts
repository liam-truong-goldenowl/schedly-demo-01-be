import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

import { EventType, LocationType } from '@/common/enums';

import { Event } from '../entities/event.entity';

export class EventResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'coding-tutoring' })
  slug: string;

  @Expose()
  @ApiProperty({ example: 'Team Meeting' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'Discuss project updates and next steps',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({ example: 60 })
  duration: number;

  @Expose()
  @ApiProperty({ enum: EventType, example: EventType.ONE_ON_ONE })
  type: EventType;

  @Expose()
  @ApiProperty({ enum: LocationType, example: LocationType.IN_PERSON })
  locationType: LocationType;

  @Expose()
  @ApiProperty({
    example: 'Conference Room A',
  })
  locationDetails: string;

  @Expose()
  @ApiProperty({ example: 10, required: false })
  inviteeLimit: number;

  @Expose()
  @ApiProperty({ example: 1 })
  scheduleId: number;

  static fromEntity(entity: Event): EventResDto {
    return plainToInstance(
      EventResDto,
      { ...entity, scheduleId: entity.schedule.id },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
