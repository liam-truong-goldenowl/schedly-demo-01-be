import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';
import { TokenRespDto } from '../dto/token-resp.dto';
import { TokenMapper } from '../mappers/token.mapper';

@Injectable()
export class RefreshTokensUserCase
  implements UseCase<RequestUser, TokenRespDto>
{
  constructor(private authService: AuthService) {}

  async execute(user: RequestUser): Promise<TokenRespDto> {
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateAccountRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });
    return TokenMapper.toResponse(tokens);
  }
}
