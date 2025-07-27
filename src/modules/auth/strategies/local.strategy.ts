import { Request } from 'express';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ReqUser } from '@/common/interfaces/req-user.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<ReqUser> {
    const user = await this.authService.validateUser(req.body);

    return { id: user.id, email: user.email };
  }
}
