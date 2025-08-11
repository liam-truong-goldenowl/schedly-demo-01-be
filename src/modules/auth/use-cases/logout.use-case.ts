import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { RequestUser } from '@/common/interfaces';

import { AuthService } from '../auth.service';

@Injectable()
export class LogoutUseCase implements UseCase<RequestUser, void> {
  constructor(private authService: AuthService) {}

  async execute(user: RequestUser) {
    await this.authService.unsetRefreshToken(user.id);
  }
}
