import { Request } from 'express';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

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
    const user = await this.authService.validateUser({
      email: req.body.email,
      password: req.body.password,
    });

    return {
      id: user.id,
      email: user.email,
      publicSlug: user.publicSlug,
    };
  }
}
