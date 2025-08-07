import { Get, Controller } from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';

import { USER_SLUG_PARAM } from '../sharing.config';
import { SharingUser } from '../decorators/sharing-user.decorator';
import { GetSharingHostUseCase } from '../use-cases/get-sharing-host.use-case';

@Controller(`sharing/:${USER_SLUG_PARAM}`)
export class SharingController {
  constructor(private getSharingUseCase: GetSharingHostUseCase) {}

  @Get('host')
  getHost(@SharingUser() user: User) {
    return this.getSharingUseCase.execute(user);
  }
}
