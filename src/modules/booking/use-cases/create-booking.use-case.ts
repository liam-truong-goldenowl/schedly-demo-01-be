import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
import { BookingCreatedEvent } from '../events/booking-created.event';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private em: EntityManager,
    private bookingService: BookingService,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateBookingDto) {
    const targetEvent = await this.bookingService.findEventOrThrow(dto.eventId);

    await this.bookingService.validateEventStartTime({
      startTime: dto.startTime,
      startDate: dto.startDate,
      eventId: targetEvent.id,
      scheduleId: targetEvent.schedule.id,
      timezone: dto.timezone,
    });
    await this.bookingService.validateEventLimit({
      eventId: targetEvent.id,
      startTime: dto.startTime,
      startDate: dto.startDate,
    });

    const eventRef = this.em.getReference(Event, targetEvent.id);
    const hostRef = this.em.getReference(User, targetEvent.user.id);

    const meeting = this.em.create(Meeting, { ...dto, event: eventRef });

    const host = this.em.create(MeetingHost, { meeting, host: hostRef });
    const invitee = this.em.create(MeetingInvitee, { meeting, ...dto });

    dto.guestEmails.forEach((email) => {
      this.em.create(MeetingGuest, { meeting, email });
    });

    await this.em.flush();
    await host.populate(['host']);

    this.eventEmitter.emit(
      BookingCreatedEvent.name,
      new BookingCreatedEvent({
        hostName: host.host.name,
        hostMail: host.host.email,
        guestMails: dto.guestEmails,
        inviteeName: invitee.name,
        inviteeMail: invitee.email,
        hostTimezone: targetEvent.schedule.timezone,
        inviteeTimezone: dto.timezone,
        startDate: dto.startDate,
        startTime: dto.startTime,
        event: {
          id: targetEvent.id,
          duration: targetEvent.duration,
          name: targetEvent.name,
          location: targetEvent.locationDetails,
        },
      }),
    );

    return MeetingMapper.toResponse(meeting);
  }
}
