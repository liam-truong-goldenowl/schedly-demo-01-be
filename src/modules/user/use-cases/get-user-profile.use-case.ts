import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { User } from '@/database/entities';

import { ProfileMapper } from '../mappers/profile.mapper';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private em: EntityManager) {}
  async execute(userId: number) {
    const user = await this.em.findOneOrFail(User, { id: userId });
    return ProfileMapper.toResponse(user);
  }
}
