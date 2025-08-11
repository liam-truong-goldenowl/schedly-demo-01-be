import { plainToInstance } from 'class-transformer';

import { User } from '@/database/entities';

import { UserProfileResDto } from '../dto';

export class ProfileMapper {
  static toResponse(user: User): UserProfileResDto {
    return plainToInstance(UserProfileResDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
