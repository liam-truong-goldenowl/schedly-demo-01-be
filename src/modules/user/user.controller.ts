import { Get, UseGuards, Controller } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAccessAuthGuard } from '@/modules/auth/guards/jwt-access-auth.guard';

import { UserProfileResDto } from './dto/res/user-profile-res.dto';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';

@Controller()
export class UserController {
  constructor(private getUserProfileUC: GetUserProfileUseCase) {}

  @Get('/profile')
  @UseGuards(JwtAccessAuthGuard)
  async getUserProfile(
    @CurrentUser('id') userId: number,
  ): Promise<UserProfileResDto> {
    return this.getUserProfileUC.execute(userId);
  }
}
