import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class SignUpResDto {
  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john_doe' })
  publicSlug: string;

  static fromUser(user: {
    name: string;
    email: string;
    publicSlug: string;
  }): SignUpResDto {
    return plainToInstance(SignUpResDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
