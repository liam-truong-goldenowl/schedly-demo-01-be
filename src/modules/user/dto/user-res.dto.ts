import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

import { User } from '@/database/entities/user.entity';

export class UserResDto {
  @Expose()
  @ApiProperty({ example: 123 })
  id: number;

  @Expose()
  @ApiProperty({ format: 'email', example: 'liam.truong@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'Liam Truong' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'liam-truong' })
  publicSlug: string;

  static fromEntity(user: User): UserResDto {
    return plainToInstance(UserResDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
