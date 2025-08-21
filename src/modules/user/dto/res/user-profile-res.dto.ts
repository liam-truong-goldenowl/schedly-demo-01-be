import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john-doe' })
  slug: string;
}
