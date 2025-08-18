import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigService } from '@/config/config.service';
import { RequestUser } from '@/common/interfaces/request-user.interface';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private token: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const { refreshSecret } = configService.getOrThrow('jwt');
    const { refreshTokenKey } = configService.getOrThrow('cookies');
    const extractTokenFromHeader = (req: Request) => {
      const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      this.token = refreshToken || '';
      return refreshToken;
    };
    const extractTokenFromCookie = (req: Request) => {
      const refreshToken = req.cookies ? req.cookies[refreshTokenKey] : null;
      this.token = refreshToken || '';
      return refreshToken;
    };
    super({
      secretOrKey: refreshSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractTokenFromHeader,
        extractTokenFromCookie,
      ]),
    });
  }

  async validate({ id: userId }: TokenPayload): Promise<RequestUser> {
    const user = await this.authService.validateJwtRefreshUser(
      userId,
      this.token,
    );
    return { id: user.id, email: user.email };
  }
}
