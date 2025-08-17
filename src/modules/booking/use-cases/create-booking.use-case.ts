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
import { CreateBookingDto } from '../dto/req/create-booking.dto';

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

  async execute({ invitees, startDate, startTime, eventId }: CreateBookingDto) {
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

    await this.meetingRepo.upsertEntity({
      event: event.id,
      startDate,
      startTime,
    });
    // const host = await this.meetingHostRepo.createEntity({
    //   meeting,
    //   host: event.user.id,
    // });
    // const invitee = await this.meetingInviteeRepo.createEntity({
    //   meeting,
    //   ...dto,
    // });

    // await host.populate(['host']);

    // this.eventEmitter.emit(
    //   BookingCreatedEvent.name,
    //   new BookingCreatedEvent({
    //     hostName: host.host.name,
    //     hostMail: host.host.email,
    //     guestMails: dto.guestEmails,
    //     inviteeName: invitee.name,
    //     inviteeMail: invitee.email,
    //     hostTimezone: event.schedule.timezone,
    //     inviteeTimezone: dto.timezone,
    //     startDate: dto.startDate,
    //     startTime: dto.startTime,
    //     event: {
    //       id: event.id,
    //       duration: event.duration,
    //       name: event.name,
    //       location: 'ahsakjh',
    //     },
    //   }),
    // );

    // return MeetingMapper.toResponse(meeting);
    return [];
  }
}
