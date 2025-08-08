import { Injectable } from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';
import { UseCase } from '@/common/interfaces/use-case.interface';

import { HostRespDto } from '../dto/host-resp.dto';
import { HostMapper } from '../mappers/host.mapper';

@Injectable()
export class GetSharingHostUseCase implements UseCase<User, HostRespDto> {
  async execute(user: User): Promise<HostRespDto> {
    return HostMapper.toResponse(user);
  }
}
