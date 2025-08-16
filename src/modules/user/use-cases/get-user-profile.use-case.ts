import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repositories/user.repository';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number) {
    const user = await this.userRepo.findOneOrThrow({ id: userId });
    return UserProfileMapper.toResponse(user);
  }
}
