import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigService } from '@/config';
import { REFRESH_TOKEN_KEY } from '@/utils/constants/cookies';

import type { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';

import type { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const { refreshSecret } = configService.getOrThrow('jwt');

    const extractTokenFromHeader = (req: Request) => {
      const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      this.injectRefreshToken(req, refreshToken);
      return refreshToken;
    };

    const extractTokenFromCookie = (req: Request) => {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_KEY];
      this.injectRefreshToken(req, refreshToken);
      return refreshToken;
    };

    super({
      passReqToCallback: true,
      secretOrKey: refreshSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractTokenFromHeader,
        extractTokenFromCookie,
      ]),
    });
  }

  private injectRefreshToken(req: Request, refreshToken: string | null) {
    req['refreshToken'] = refreshToken;
  }

  async validate(req: Request, payload: TokenPayload): Promise<RequestUser> {
    const userId = payload.id;
    const refreshToken = this.extractRefreshToken(req);

    const user = await this.authService.validateJwtRefreshUser({
      userId,
      refreshToken,
    });

    return { id: user.id, email: user.email };
  }

  private extractRefreshToken(req: Request) {
    return req['refreshToken'];
  }
}
