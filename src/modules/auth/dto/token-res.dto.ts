import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class TokenResDto {
  @Expose()
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @Expose()
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  static fromTokens(tokens: {
    accessToken: string;
    refreshToken: string;
  }): TokenResDto {
    return plainToInstance(TokenResDto, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
