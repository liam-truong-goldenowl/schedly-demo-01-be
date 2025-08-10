import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import type { Request } from 'express';

import { ConfigService } from '@/config/config.service';
import { ACCESS_TOKEN_KEY } from '@/utils/constants/cookies';

import type { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';

import type { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private confService: ConfigService,
  ) {
    const { secret } = confService.getOrThrow('jwt');

    const extractTokenFromCookie = (req: Request) => {
      return req.cookies?.[ACCESS_TOKEN_KEY];
    };

    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractTokenFromCookie,
      ]),
    });
  }

  async validate(payload: TokenPayload): Promise<RequestUser> {
    const user = await this.authService.validateJwtUser(payload.id);
    return { id: user.id, email: user.email };
  }
}
