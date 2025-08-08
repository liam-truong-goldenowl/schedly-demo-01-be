import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Meeting } from './entities/meeting.entity';
import { BookingService } from './services/booking.service';
import { MeetingHost } from './entities/meeting-host.entity';
import { MeetingGuest } from './entities/meeting-guest.entity';
import { MeetingInvitee } from './entities/meeting-invitee.entity';
import { BookingController } from './controllers/booking.controller';
import { CreateBookingUseCase } from './use-cases/create-booking.use-case';

@Module({
  controllers: [BookingController],
  providers: [CreateBookingUseCase, BookingService],
  imports: [
    MikroOrmModule.forFeature([
      Meeting,
      MeetingHost,
      MeetingGuest,
      MeetingInvitee,
    ]),
  ],
})
export class BookingModule {}
