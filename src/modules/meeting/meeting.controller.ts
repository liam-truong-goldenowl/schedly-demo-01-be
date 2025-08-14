import { Get, Query, UseGuards, Controller } from '@nestjs/common';

import { CurrentUser } from '@/decorators';

import { JwtAuthGuard } from '../auth/guards';

import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';
import { ListMeetingsQueryDto } from './dto/req/list-meetings-query.dto';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingController {
  constructor(private listMeetingsUseCase: ListMeetingsUseCase) {}

  @Get()
  async listMeetings(
    @CurrentUser('id') userId: number,
    @Query() query: ListMeetingsQueryDto,
  ) {
    return this.listMeetingsUseCase.execute({ userId, ...query });
  }
}
