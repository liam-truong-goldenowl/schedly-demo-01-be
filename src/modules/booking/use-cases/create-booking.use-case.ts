import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Event } from '@/modules/event/entities/event.entity';
import { Meeting } from '@/modules/meeting/entities/meeting.entity';
import { MeetingHost } from '@/modules/meeting/entities/meeting-host.entity';
import { EventRepository } from '@/modules/event/repositories/event.repository';
import { MeetingInvitee } from '@/modules/meeting/entities/meeting-invitee.entity';
import { MeetingRepository } from '@/modules/meeting/repositories/meeting.repository';
import { MeetingHostRepository } from '@/modules/meeting/repositories/meeting-host.repository';
import { MeetingInviteeRepository } from '@/modules/meeting/repositories/meeting-invitee.repository';

import { BookingService } from '../booking.service';
import { MeetingMapper } from '../mappers/meeting.mapper';
import { CreateBookingDto } from '../dto/req/create-booking.dto';
import { BookingCreatedEvent } from '../events/booking-created.event';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Meeting)
    private readonly meetingRepo: MeetingRepository,
    @InjectRepository(Event)
    private readonly eventRepository: EventRepository,
    @InjectRepository(MeetingHost)
    private readonly meetingHostRepo: MeetingHostRepository,
    @InjectRepository(MeetingInvitee)
    private readonly meetingInviteeRepo: MeetingInviteeRepository,
    private readonly bookingService: BookingService,
  ) {}

  async execute({
    invitees,
    startDate,
    startTime,
    eventId,
    timezone,
    note,
  }: CreateBookingDto) {
    const event = await this.eventRepository.findOneOrThrow(eventId, {
      populate: ['schedule', 'schedule.user'],
    });

    await this.bookingService.validateEventStartTime(
      event.user.id,
      event.id,
      event.schedule.id,
      {
        time: startTime,
        date: startDate,
        duration: event.duration,
      },
    );
    await this.bookingService.validateEventLimit(event.id, event.inviteeLimit, {
      startTime,
      startDate,
      invitees: invitees.length,
    });

    const host = event.user;
    const meeting = await this.meetingRepo.upsertEntity(
      { event, startDate, startTime },
      { event, startDate, startTime },
    );
    await this.meetingHostRepo.upsertEntity(
      { meeting, host },
      { meeting, host },
    );
    await Promise.all(
      invitees.map(({ email, name }) =>
        this.meetingInviteeRepo.upsertEntity(
          { meeting, email, name },
          { name, timezone, email, meeting, note },
        ),
      ),
    );

    this.eventEmitter.emit(
      BookingCreatedEvent.name,
      new BookingCreatedEvent({
        host: {
          email: host.email,
          name: host.name,
          timezone: event.schedule.timezone,
        },
        invitees,
        inviteeTimezone: timezone,
        startDate,
        startTime,
        event: {
          id: event.id,
          duration: event.duration,
          name: event.name,
        },
      }),
    );

    return MeetingMapper.toResponse(meeting);
  }
}
