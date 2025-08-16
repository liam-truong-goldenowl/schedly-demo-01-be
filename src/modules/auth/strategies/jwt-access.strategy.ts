import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { RequestUser } from '@/common/interfaces';
import { ConfigService } from '@/config/config.service';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly confService: ConfigService,
  ) {
    const { secret } = confService.getOrThrow('jwt');
    const { accessTokenKey } = confService.getOrThrow('cookies');
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => (req.cookies ? req.cookies[accessTokenKey] : null),
      ]),
    });
  }

  async validate(payload: TokenPayload): Promise<RequestUser> {
    const user = await this.authService.validateJwtUser(payload.id);
    return { id: user.id, email: user.email };
  }
}
