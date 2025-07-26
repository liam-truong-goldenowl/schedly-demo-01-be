import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService as ConfService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { IJwtStrategy, ITokenPayload } from '../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private confService: ConfService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req.cookies?.[
            confService.getOrThrow<string>('jwt.refreshTokenCookieName')
          ],
      ]),
      secretOrKey: confService.getOrThrow<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: ITokenPayload): Promise<IJwtStrategy> {
    const userId = payload.id;
    const refreshToken =
      req.cookies?.[
        this.confService.getOrThrow<string>('jwt.refreshTokenCookieName')
      ];

    const user = await this.authService.validateJwtRefreshUser({
      userId,
      refreshToken,
    });

    return {
      id: user.id,
      email: user.email,
      publicSlug: user.publicSlug,
    };
  }
}
