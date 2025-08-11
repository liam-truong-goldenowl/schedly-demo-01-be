import { Get, Controller } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

import { User } from '@/database/entities';

import { EventResDto } from '../event/dto';

import { HostResDto } from './dto';
import { SharingUser } from './decorators';
import { USER_SLUG_PARAM } from './sharing.config';
import { GetSharingHostUseCase, GetSharingEventsUseCase } from './use-cases';

@Controller(`sharing/:${USER_SLUG_PARAM}`)
@ApiParam({ name: USER_SLUG_PARAM, example: 'john-doe', type: String })
export class SharingController {
  constructor(
    private getHostUseCase: GetSharingHostUseCase,
    private getEventsUseCase: GetSharingEventsUseCase,
  ) {}

  @Get('host')
  @ApiResponse({ type: HostResDto })
  getHost(@SharingUser() user: User) {
    return this.getHostUseCase.execute(user);
  }

  @Get('events')
  @ApiResponse({ type: [EventResDto] })
  getEvents(@SharingUser() user: User) {
    return this.getEventsUseCase.execute(user);
  }
}
