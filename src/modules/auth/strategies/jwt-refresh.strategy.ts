import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { REFRESH_TOKEN_KEY } from '@/utils/constants/cookies';

import type { IReqUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';

import type { ITokenPayload } from '../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    confService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
      secretOrKey: confService.getOrThrow<string>('jwt.refreshSecret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshTokenCookie = req.cookies?.[REFRESH_TOKEN_KEY];
          const refreshTokenHeader =
            ExtractJwt.fromAuthHeaderAsBearerToken()(req);

          const refreshToken = refreshTokenHeader || refreshTokenCookie;

          if (refreshToken) {
            req['refreshToken'] = refreshToken;
          }

          return refreshToken || null;
        },
      ]),
    });
  }

  async validate(req: Request, payload: ITokenPayload): Promise<IReqUser> {
    const userId = payload.id;
    const refreshToken = req['refreshToken'];

    const user = await this.authService.validateJwtRefreshUser({
      userId,
      refreshToken,
    });

    return { id: user.id, email: user.email };
  }
}
