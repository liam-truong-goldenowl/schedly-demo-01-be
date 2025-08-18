import { Get, Query, UseGuards, Controller } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';

import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';
import { ListMeetingsQueryDto } from './dto/req/list-meetings-query.dto';

@Controller('meetings')
@UseGuards(JwtAccessAuthGuard)
export class MeetingController {
  constructor(private listMeetingsUseCase: ListMeetingsUseCase) {}

  @Get()
  async listMeetings(
    @CurrentUser('id') userId: number,
    @Query() query: ListMeetingsQueryDto,
  ) {
    return this.listMeetingsUseCase.execute(userId, query);
  }
}
