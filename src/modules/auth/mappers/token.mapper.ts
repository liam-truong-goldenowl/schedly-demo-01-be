import { plainToInstance } from 'class-transformer';

import { TokenDto } from '../dto/req/token.dto';
import { TokenResDto } from '../dto/res/token-res.dto';

export class TokenMapper {
  static toResponse(tokens: TokenDto): TokenResDto {
    return plainToInstance(TokenResDto, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
