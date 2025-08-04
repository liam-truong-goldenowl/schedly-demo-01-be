import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { ACCESS_TOKEN_KEY } from '@/utils/constants/cookies';

import type { IReqUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';

import type { ITokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    confService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      secretOrKey: confService.getOrThrow<string>('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies?.[ACCESS_TOKEN_KEY],
      ]),
    });
  }

  async validate({ id }: ITokenPayload): Promise<IReqUser> {
    const user = await this.authService.validateJwtUser({ id });

    return { id, email: user.email };
  }
}
