import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error, user: any, info: Error) {
    const error = err || info;

    if (error) {
      if (error instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      }
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
