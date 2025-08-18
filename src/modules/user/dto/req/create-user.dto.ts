import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'America/New_York' })
  timezone: string;

  @ApiProperty({ example: 'password123', format: 'password' })
  password: string;
}
