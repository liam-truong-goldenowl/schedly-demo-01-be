import { plainToInstance } from 'class-transformer';

import { User } from '@/database/entities/user.entity';

import { HostRespDto } from '../dto/host-resp.dto';

export class HostMapper {
  static toResponse(user: User): HostRespDto {
    return plainToInstance(HostRespDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
