import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenExpiredException } from '../exceptions/token-expired';
import { InvalidTokenException } from '../exceptions/invalid-token';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(_: unknown, user: any, error: Error) {
    if (error || !user) {
      if (error instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      }

      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }

      throw new UnauthorizedException();
    }

    return user;
  }
}
