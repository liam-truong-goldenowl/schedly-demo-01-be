import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';
import { TokenResDto } from '../dto/token-res.dto';
import { TokenMapper } from '../mappers/token.mapper';

@Injectable()
export class RefreshTokensUserCase
  implements UseCase<RequestUser, TokenResDto>
{
  constructor(private authService: AuthService) {}

  async execute(user: RequestUser): Promise<TokenResDto> {
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateAccountRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });
    return TokenMapper.toResponse(tokens);
  }
}
