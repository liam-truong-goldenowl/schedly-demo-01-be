import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';

import { InvalidTokenException } from '../exceptions/invalid-token';
import { TokenExpiredException } from '../exceptions/token-expired';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
