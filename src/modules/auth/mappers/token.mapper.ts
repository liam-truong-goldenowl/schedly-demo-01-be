import { plainToInstance } from 'class-transformer';

import { TokenDto } from '../dto/token.dto';
import { TokenRespDto } from '../dto/token-resp.dto';

export class TokenMapper {
  static toResponse(tokens: TokenDto): TokenRespDto {
    return plainToInstance(TokenRespDto, tokens, {
      excludeExtraneousValues: true,
    });
  }
}
