import {
  EntityManager,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import {
  User,
  Event,
  Meeting,
  MeetingHost,
  MeetingGuest,
  MeetingInvitee,
} from '@/database/entities';

import { CreateBookingDto } from '../dto';
import { MeetingMapper } from '../mappers';
import { BookingService } from '../booking.service';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private em: EntityManager,
    private bookingService: BookingService,
  ) {}

  async execute(dto: CreateBookingDto) {
    const targetEvent = await this.em.findOne(
      Event,
      { id: dto.eventId },
      { fields: ['id', 'user', 'schedule'] },
    );

    if (!targetEvent) {
      throw new NotFoundException('Event not found');
    }

    await this.bookingService.validateEventStartTime({
      startTime: dto.startTime,
      startDate: dto.startDate,
      eventId: targetEvent.id,
      scheduleId: targetEvent.schedule.id,
      timezone: dto.timezone,
    });

    try {
      const eventRef = this.em.getReference(Event, targetEvent.id);
      const hostRef = this.em.getReference(User, targetEvent.user.id);

      const meeting = this.em.create(Meeting, { ...dto, event: eventRef });

      this.em.create(MeetingHost, { meeting, host: hostRef });
      this.em.create(MeetingInvitee, { meeting, ...dto });

      dto.guestEmails.forEach((email) => {
        this.em.create(MeetingGuest, { meeting, email });
      });

      await this.em.flush();

      return MeetingMapper.toResponse(meeting);
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
