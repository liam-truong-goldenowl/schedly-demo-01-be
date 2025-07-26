import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { IJwtStrategy, ITokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req?.cookies?.['accessToken'],
      ]),
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: ITokenPayload): Promise<IJwtStrategy> {
    const user = await this.authService.validateJwtUser({
      email: payload.email,
    });

    return {
      id: user.id,
      email: user.email,
      publicSlug: user.publicSlug,
    };
  }
}
