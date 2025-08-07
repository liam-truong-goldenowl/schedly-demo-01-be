import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';

import { HostMapper } from '../mappers/host.mapper';

@Injectable()
export class GetSharingHostUseCase {
  async execute(user: User) {
    return HostMapper.toResponse(user);
  }
}
