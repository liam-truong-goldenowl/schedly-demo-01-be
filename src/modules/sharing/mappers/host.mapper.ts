import { plainToInstance } from 'class-transformer';

import { User } from '@/modules/user/entities/user.entity';

import { HostRespDto } from '../dtos/host-resp.dto';

export class HostMapper {
  static toResponse(user: User): HostRespDto {
    return plainToInstance(HostRespDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
