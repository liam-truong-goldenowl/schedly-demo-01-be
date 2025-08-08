import {
  EntityManager,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';
import { Event } from '@/modules/event/entities/event.entity';
import { UseCase } from '@/common/interfaces/use-case.interface';

import { Meeting } from '../entities/meeting.entity';
import { BookingRespDto } from '../dto/booking-resp.dto';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingService } from '../services/booking.service';
import { MeetingHost } from '../entities/meeting-host.entity';
import { MeetingGuest } from '../entities/meeting-guest.entity';
import { MeetingInvitee } from '../entities/meeting-invitee.entity';

@Injectable()
export class CreateBookingUseCase
  implements UseCase<CreateBookingDto, BookingRespDto>
{
  constructor(
    private em: EntityManager,
    private bookingService: BookingService,
  ) {}

  async execute(dto: CreateBookingDto): Promise<BookingRespDto> {
    const targetEvent = await this.em.findOne(
      Event,
      { id: dto.eventId },
      { fields: ['id', 'user'] },
    );

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    const isValidStartTime = await this.bookingService.isValidStartTime({
      startTime: dto.startTime,
      eventId: targetEvent.id,
    });

    if (!isValidStartTime) {
      throw new BadRequestException('Invalid start time for the event');
    }

    const eventRef = this.em.getReference(Event, targetEvent.id);
    const hostRef = this.em.getReference(User, targetEvent.user.id);

    const meeting = this.em.create(Meeting, { ...dto, event: eventRef });

    this.em.create(MeetingHost, { meeting, host: hostRef });
    this.em.create(MeetingInvitee, { meeting, ...dto });

    dto.guestEmails.forEach((email) => {
      this.em.create(MeetingGuest, { meeting, email });
    });

    try {
      await this.em.flush();

      return { id: meeting.id };
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          'Booking already exists for this time slot',
        );
      }

      throw error;
    }
  }
}
