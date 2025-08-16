import { Injectable } from '@nestjs/common';

import { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';
import { TokenMapper } from '../mappers/token.mapper';

@Injectable()
export class RefreshTokensUserCase {
  constructor(private authService: AuthService) {}

  async execute(attemptUser: RequestUser) {
    const tokens = await this.authService.generateTokens(attemptUser);
    await this.authService.resetToken(attemptUser.id, tokens.refreshToken);
    return TokenMapper.toResponse(tokens);
  }
}
