import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';

import { Meeting } from './entities/meeting.entity';
import { MeetingController } from './meeting.controller';
import { MeetingHost } from './entities/meeting-host.entity';
import { MeetingGuest } from './entities/meeting-guest.entity';
import { MeetingInvitee } from './entities/meeting-invitee.entity';
import { MeetingRepository } from './repositories/meeting.repository';
import { ListMeetingsUseCase } from './use-cases/list-meetings.use-case';
import { MeetingHostRepository } from './repositories/meeting-host.repository';
import { MeetingGuestRepository } from './repositories/meeting-guest.repository';
import { MeetingInviteeRepository } from './repositories/meeting-invitee.repository';

@Module({
  controllers: [MeetingController],
  imports: [
    MikroOrmModule.forFeature([
      Meeting,
      MeetingGuest,
      MeetingHost,
      MeetingInvitee,
    ]),
    AuthModule,
  ],
  exports: [
    MeetingRepository,
    MeetingRepository,
    MeetingGuestRepository,
    MeetingInviteeRepository,
    MeetingHostRepository,
  ],
  providers: [
    ListMeetingsUseCase,
    MeetingRepository,
    MeetingGuestRepository,
    MeetingInviteeRepository,
    MeetingHostRepository,
  ],
})
export class MeetingModule {}
