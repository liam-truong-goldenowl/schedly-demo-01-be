import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { User } from '@/database/entities/user.entity';

import { HostRespDto } from '../dto/host-resp.dto';
import { HostMapper } from '../mappers/host.mapper';

@Injectable()
export class GetSharingHostUseCase implements UseCase<User, HostRespDto> {
  async execute(user: User): Promise<HostRespDto> {
    return HostMapper.toResponse(user);
  }
}
