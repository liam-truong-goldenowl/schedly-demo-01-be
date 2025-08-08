import { Get, Controller } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

import { User } from '@/modules/user/entities/user.entity';

import { HostRespDto } from '../dto/host-resp.dto';
import { USER_SLUG_PARAM } from '../sharing.config';
import { EventRespDto } from '../dto/event-resp.dto';
import { SharingUser } from '../decorators/sharing-user.decorator';
import { GetSharingHostUseCase } from '../use-cases/get-sharing-host.use-case';
import { GetSharingEventsUseCase } from '../use-cases/get-sharing-events.use-case';

@Controller(`sharing/:${USER_SLUG_PARAM}`)
@ApiParam({ name: USER_SLUG_PARAM, example: 'john-doe', type: String })
export class SharingController {
  constructor(
    private getHostUseCase: GetSharingHostUseCase,
    private getEventsUseCase: GetSharingEventsUseCase,
  ) {}

  @Get('host')
  @ApiResponse({ type: HostRespDto })
  getHost(@SharingUser() user: User) {
    return this.getHostUseCase.execute(user);
  }

  @Get('events')
  @ApiResponse({ type: [EventRespDto] })
  getEvents(@SharingUser() user: User) {
    return this.getEventsUseCase.execute(user);
  }
}
