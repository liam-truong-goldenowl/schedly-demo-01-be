import { Expose, plainToInstance } from 'class-transformer';

import { User } from '../entities/user.entity';

export class CreateUserResDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  avatarUrl: string | null;

  @Expose()
  publicSlug: string;

  static fromEntity(user: User): CreateUserResDto {
    return plainToInstance(CreateUserResDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
