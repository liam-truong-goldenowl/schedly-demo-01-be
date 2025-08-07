import { Get, Controller } from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';

import { USER_SLUG_PARAM } from '../sharing.config';
import { SharingUser } from '../decorators/sharing-user.decorator';
import { GetSharingHostUseCase } from '../use-cases/get-sharing-host.use-case';
import { GetSharingEventsUseCase } from '../use-cases/get-sharing-events.use-case';

@Controller(`sharing/:${USER_SLUG_PARAM}`)
export class SharingController {
  constructor(
    private getHostUseCase: GetSharingHostUseCase,
    private getEventsUseCase: GetSharingEventsUseCase,
  ) {}

  @Get('host')
  getHost(@SharingUser() user: User) {
    return this.getHostUseCase.execute(user);
  }

  @Get('events')
  getEvents(@SharingUser() user: User) {
    return this.getEventsUseCase.execute(user);
  }
}
