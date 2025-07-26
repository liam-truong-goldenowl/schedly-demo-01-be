import { Request } from 'express';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { ILocalStrategy } from '../auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<ILocalStrategy> {
    const user = await this.authService.validateUser(req.body);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      email: user.email,
      publicSlug: user.publicSlug,
    };
  }
}
