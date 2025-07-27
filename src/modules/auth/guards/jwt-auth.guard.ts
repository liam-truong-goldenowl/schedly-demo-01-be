import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: Error | undefined) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('TokenExpired');
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('InvalidToken');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    return user;
  }
}
