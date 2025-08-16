import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { TokenExpiredException } from '../exceptions/token-expired.exception';

export class BaseJwtAuthGuard extends AuthGuard() {
  constructor(strategyName: string) {
    super(strategyName);
  }

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
