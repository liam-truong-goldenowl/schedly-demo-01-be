import { plainToInstance } from 'class-transformer';

import { User } from '@/modules/user/entities/user.entity';

import { HostResDto } from '../dto/host-res.dto';

export class HostMapper {
  static toResponse(user: User): HostResDto {
    return plainToInstance(HostResDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
