import { plainToInstance } from 'class-transformer';

import { TokenDto } from '../dto/token.dto';
import { TokenResDto } from '../dto/token-res.dto';

export class TokenMapper {
  static toResponse(tokens: TokenDto): TokenResDto {
    return plainToInstance(TokenResDto, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
