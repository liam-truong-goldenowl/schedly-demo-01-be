import { Module } from '@nestjs/common';

import { MeetingController } from './meeting.controller';
import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';

@Module({
  controllers: [MeetingController],
  providers: [ListMeetingsUseCase],
})
export class MeetingModule {}
