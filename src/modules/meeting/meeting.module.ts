import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';

import { Meeting } from './entities/meeting.entity';
import { MeetingController } from './meeting.controller';
import { MeetingHost } from './entities/meeting-host.entity';
import { MeetingInvitee } from './entities/meeting-invitee.entity';
import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';

@Module({
  controllers: [MeetingController],
  imports: [
    MikroOrmModule.forFeature([Meeting, MeetingHost, MeetingInvitee]),
    AuthModule,
  ],
  providers: [ListMeetingsUseCase],
})
export class MeetingModule {}
