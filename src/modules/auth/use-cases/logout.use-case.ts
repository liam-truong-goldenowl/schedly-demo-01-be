import { Injectable } from '@nestjs/common';

import { RequestUser } from '@/common/interfaces/request-user.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class LogoutUseCase {
  constructor(private authService: AuthService) {}

  async execute(user: RequestUser) {
    await this.authService.unsetToken(user.id);
  }
}
