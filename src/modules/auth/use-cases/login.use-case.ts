import { Injectable } from '@nestjs/common';

import { RequestUser } from '@/common/interfaces/request-user.interface';

import { AuthService } from '../auth.service';
import { TokenMapper } from '../mappers/token.mapper';
import { TokenResDto } from '../dto/res/token-res.dto';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(attemptUser: RequestUser): Promise<TokenResDto> {
    const tokens = await this.authService.generateTokens(attemptUser);
    await this.authService.resetToken(attemptUser.id, tokens.refreshToken);
    return TokenMapper.toResponse(tokens);
  }
}
