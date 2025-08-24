import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

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

@Injectable()
export class CreateBookingUseCase {
  constructor(
    private readonly bookingService: BookingService,
    @InjectRepository(Meeting)
    private readonly meetingRepo: MeetingRepository,
    @InjectRepository(Event)
    private readonly eventRepository: EventRepository,
    @InjectRepository(MeetingHost)
    private readonly meetingHostRepo: MeetingHostRepository,
    @InjectRepository(MeetingInvitee)
    private readonly meetingInviteeRepo: MeetingInviteeRepository,
  ) {}

  async execute(dto: CreateBookingDto) {
    const { invitees, startDate, startTime, eventId, timezone, note } = dto;

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

    await this.bookingService.scheduleMeetingReminders(
      {
        id: event.id,
        name: event.name,
        date: startDate,
        time: startTime,
      },
      {
        name: host.name,
        email: host.email,
        timezone: event.schedule.timezone,
      },
      invitees.map((i) => ({
        email: i.email,
        name: i.name,
        timezone: timezone,
      })),
    );
    await this.bookingService.scheduleMeetingConfirmationEmails(
      {
        id: event.id,
        name: event.name,
        timezone: event.schedule.timezone,
      },
      {
        date: startDate,
        time: startTime,
      },
      {
        name: host.name,
        email: host.email,
        timezone: event.schedule.timezone,
      },
      invitees.map((i) => ({
        email: i.email,
        name: i.name,
        timezone: timezone,
      })),
    );

    return MeetingMapper.toResponse(meeting);
  }
}
