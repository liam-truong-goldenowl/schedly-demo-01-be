import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john_doe' })
  publicSlug: string;

  constructor(dto: { email: string; name: string; publicSlug: string }) {
    this.email = dto.email;
    this.name = dto.name;
    this.publicSlug = dto.publicSlug;
  }
}
