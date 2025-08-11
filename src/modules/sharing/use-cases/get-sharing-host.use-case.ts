import { Injectable } from '@nestjs/common';

import { User } from '@/database/entities';

import { HostResDto } from '../dto';
import { HostMapper } from '../mappers';

@Injectable()
export class GetSharingHostUseCase {
  async execute(user: User): Promise<HostResDto> {
    return HostMapper.toResponse(user);
  }
}
