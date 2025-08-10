import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRespDto {
  @Expose()
  @ApiProperty({ format: 'email' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john_doe' })
  publicSlug: string;
}
