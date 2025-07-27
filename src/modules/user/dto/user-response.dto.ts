import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '12345' })
  id: number;

  @ApiProperty({ format: 'email', example: 'liam.truong@example.com' })
  email: string;

  @ApiProperty({ example: 'Liam Truong' })
  name: string;

  @ApiProperty({ example: 'liam-truong' })
  publicSlug: string;

  constructor(dto: User) {
    this.id = dto.id;
    this.name = dto.name;
    this.email = dto.email;
    this.publicSlug = dto.publicSlug;
  }
}
