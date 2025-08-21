import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

import { HostMapper } from '../mappers/host.mapper';

@Injectable()
export class GetSharingHostUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(slug: string) {
    const host = await this.userRepo.findOneOrThrow({ slug });
    return HostMapper.toResponse(host);
  }
}
