import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { ACCESS_TOKEN_KEY } from '@/utils/constants/cookies';
import { ReqUser } from '@/common/interfaces/req-user.interface';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.[ACCESS_TOKEN_KEY],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: TokenPayload): Promise<ReqUser> {
    const user = await this.authService.validateJwtUser({
      email: payload.email,
    });

    return { id: user.id, email: user.email };
  }
}
