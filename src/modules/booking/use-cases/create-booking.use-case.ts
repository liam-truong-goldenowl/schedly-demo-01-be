import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventRepository } from '@/modules/event/repositories/event.repository';
import { MeetingRepository } from '@/modules/meeting/repositories/meeting.repository';
import { MeetingHostRepository } from '@/modules/meeting/repositories/meeting-host.repository';
import { MeetingGuestRepository } from '@/modules/meeting/repositories/meeting-guest.repository';
import { MeetingInviteeRepository } from '@/modules/meeting/repositories/meeting-invitee.repository';

import { MeetingMapper } from '../mappers/meeting.mapper';
import { CreateBookingDto } from '../dto/req/create-booking.dto';
import { BookingCreatedEvent } from '../events/booking-created.event';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly meetingRepo: MeetingRepository,
    private readonly eventRepository: EventRepository,
    private readonly meetingHostRepo: MeetingHostRepository,
    private readonly meetingGuestRepo: MeetingGuestRepository,
    private readonly meetingInviteeRepo: MeetingInviteeRepository,
  ) {}

  async execute(dto: CreateBookingDto) {
    const event = await this.eventRepository.findOneOrThrow(dto.eventId);

    // await this.bookingService.validateEventStartTime({
    //   startTime: dto.startTime,
    //   startDate: dto.startDate,
    //   eventId: targetEvent.id,
    //   scheduleId: targetEvent.schedule.id,
    //   timezone: dto.timezone,
    // });
    // await this.bookingService.validateEventLimit({
    //   eventId: targetEvent.id,
    //   startTime: dto.startTime,
    //   startDate: dto.startDate,
    // });

    const meeting = await this.meetingRepo.createEntity({
      ...dto,
      event: event.id,
    });
    const host = await this.meetingHostRepo.createEntity({
      meeting,
      host: event.user.id,
    });
    const invitee = await this.meetingInviteeRepo.createEntity({
      meeting,
      ...dto,
    });
    await this.meetingGuestRepo.createManyEntities(
      dto.guestEmails.map((email) => ({ meeting, email })),
    );

    await host.populate(['host']);

    this.eventEmitter.emit(
      BookingCreatedEvent.name,
      new BookingCreatedEvent({
        hostName: host.host.name,
        hostMail: host.host.email,
        guestMails: dto.guestEmails,
        inviteeName: invitee.name,
        inviteeMail: invitee.email,
        hostTimezone: event.schedule.timezone,
        inviteeTimezone: dto.timezone,
        startDate: dto.startDate,
        startTime: dto.startTime,
        event: {
          id: event.id,
          duration: event.duration,
          name: event.name,
          location: event.locationDetails,
        },
      }),
    );

    return MeetingMapper.toResponse(meeting);
  }
}
