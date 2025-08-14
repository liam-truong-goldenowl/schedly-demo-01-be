import { plainToInstance } from 'class-transformer';

import { Meeting } from '@/database/entities';
import { formatDateString } from '@/utils/helpers/time';

import { MeetingResDto } from '../dto/res/meeting-res.dto';

export class MeetingMapper {
  static toResponse(entity: Meeting): MeetingResDto {
    return plainToInstance(
      MeetingResDto,
      {
        ...entity,
        startDate: formatDateString(entity.startDate),
        invitees: entity.invitees.getItems(),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  static toResponseList(entities: Meeting[]): MeetingResDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
