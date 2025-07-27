import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService as ConfService } from '@nestjs/config';

import { REFRESH_TOKEN_KEY } from '@/utils/constants/cookies';
import { ReqUser } from '@/common/interfaces/req-user.interface';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    confService: ConfService,
    private authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.[REFRESH_TOKEN_KEY],
      ]),
      secretOrKey: confService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<ReqUser> {
    const userId = payload.id;
    const refreshToken = req.cookies?.[REFRESH_TOKEN_KEY];

    const user = await this.authService.validateJwtRefreshUser({
      userId,
      refreshToken,
    });

    return { id: user.id, email: user.email };
  }
}
