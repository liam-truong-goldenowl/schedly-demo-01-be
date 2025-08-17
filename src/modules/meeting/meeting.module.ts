import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';

import { Meeting } from './entities/meeting.entity';
import { MeetingController } from './meeting.controller';
import { MeetingHost } from './entities/meeting-host.entity';
import { MeetingInvitee } from './entities/meeting-invitee.entity';
import { MeetingRepository } from './repositories/meeting.repository';
import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';
import { MeetingHostRepository } from './repositories/meeting-host.repository';

@Module({
  controllers: [MeetingController],
  imports: [
    MikroOrmModule.forFeature([Meeting, MeetingHost, MeetingInvitee]),
    AuthModule,
  ],

  providers: [ListMeetingsUseCase, MeetingRepository, MeetingHostRepository],
})
export class MeetingModule {}
