import { Get, Param, Controller } from '@nestjs/common';

import { HostResDto } from './dto/res/host-res.dto';
import { GetHostParamsDto } from './dto/req/get-host-params.dto';
import { GetEventsParamsDto } from './dto/req/get-events-params.dto';
import { SharingEventResDto } from './dto/res/sharing-event-res.dto';
import { GetSharingHostUseCase } from './use-cases/get-sharing-host.use-case';
import { GetSharingEventsUseCase } from './use-cases/get-sharing-events.use-case';

@Controller(`sharing/:userSlug`)
export class SharingController {
  constructor(
    private readonly getHostUC: GetSharingHostUseCase,
    private readonly getEventsUC: GetSharingEventsUseCase,
  ) {}

  @Get('host')
  getHost(@Param() { userSlug }: GetHostParamsDto): Promise<HostResDto> {
    return this.getHostUC.execute(userSlug);
  }

  @Get('events')
  getEvents(
    @Param() { userSlug }: GetEventsParamsDto,
  ): Promise<SharingEventResDto[]> {
    return this.getEventsUC.execute(userSlug);
  }
}
