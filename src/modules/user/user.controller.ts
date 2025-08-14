import { Get, UseGuards, Controller } from '@nestjs/common';

import { CurrentUser } from '@/decorators';

import { JwtAuthGuard } from '../auth/guards';

import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';

@Controller()
export class UserController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@CurrentUser('id') userId: number) {
    return this.getUserProfileUseCase.execute(userId);
  }
}
