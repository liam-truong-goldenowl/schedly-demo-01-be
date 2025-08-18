import { DateTime } from 'luxon';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger, Injectable } from '@nestjs/common';

import { MailService } from '@/modules/utils/services/mail.service';

import { BookingCreatedEvent } from '../events/booking-created.event';

@Injectable()
export class BookingCreatedListener {
  private logger = new Logger(BookingCreatedListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent(BookingCreatedEvent.name)
  async handleBookingCreatedEvent(event: BookingCreatedEvent) {
    await Promise.all([
      this.sendMailToHost(event),
      this.sendMailToInvitee(event),
    ]);
  }

  async sendMailToHost({ payload }: BookingCreatedEvent) {
    const isoDate = `${payload.startDate}T${payload.startTime}`;
    const hostDatetime = DateTime.fromISO(isoDate, {
      zone: payload.host.timezone,
    }).toFormat('cccc, LLLL dd yyyy HH:mm a');
    const inviteeDatetime = DateTime.fromISO(isoDate, {
      zone: payload.host.timezone,
    })
      .setZone(payload.inviteeTimezone)
      .toFormat('cccc, LLLL dd yyyy HH:mm a');
    const recipient = payload.host.email;
    const subject = `New Meeting: ${payload.event.name} - ${hostDatetime}`;

    const body = await this.hostMailTemplate({
      event: payload.event.name,
      host: {
        name: payload.host.name,
        datetime: hostDatetime,
        timezone: payload.host.timezone,
      },
      inviteeTimezone: payload.inviteeTimezone,
      inviteeDatetime: inviteeDatetime,
    });

    await this.mailService.send(recipient, body, subject);
  }

  async hostMailTemplate(data: {
    event: string;
    host: {
      name: string;
      timezone: string;
      datetime: string;
    };
    inviteeTimezone: string;
    inviteeDatetime: string;
  }) {
    return `
      <p>Hi ${data.host.name},</p>
      <p>A new event has been scheduled.</p>
      <p><b>Event type:</b> ${data.event}</p>
      <p><b>Date & Time:</b> ${data.host.datetime} (${data.host.timezone})</p>
      <p><b>Invitee Date & Time:</b> ${data.inviteeDatetime} (${data.inviteeTimezone})</p>
    `;
  }

  async sendMailToInvitee({ payload }: BookingCreatedEvent) {
    const isoDate = `${payload.startDate}T${payload.startTime}`;
    const hostDatetime = DateTime.fromISO(isoDate, {
      zone: payload.host.timezone,
    }).toFormat('cccc, LLLL dd yyyy HH:mm a');
    const inviteeDatetime = DateTime.fromISO(isoDate, {
      zone: payload.host.timezone,
    })
      .setZone(payload.inviteeTimezone)
      .toFormat('cccc, LLLL dd yyyy HH:mm a');

    const subject = `New Meeting: ${payload.event.name} - ${inviteeDatetime}`;

    await Promise.all(
      payload.invitees.map(async ({ email, name }) => {
        const recipient = email;
        const body = await this.inviteeMailTemplate({
          eventName: payload.event.name,
          inviteeName: name,
          datetime: inviteeDatetime,
          timezone: payload.inviteeTimezone,
          hostTimezone: payload.host.timezone,
          hostDatetime: hostDatetime,
        });
        return this.mailService.send(recipient, body, subject);
      }),
    );
  }

  async inviteeMailTemplate(data: {
    eventName: string;
    inviteeName: string;
    datetime: string;
    timezone: string;
    hostTimezone: string;
    hostDatetime: string;
  }) {
    return `
      <p>Hi ${data.inviteeName},</p>
      <p>You have been invited to a new event</p>
      <p><b>Event:</b> ${data.eventName}</p>
      <p><b>Date & Time:</b> ${data.datetime} (${data.timezone})</p>
      <p><b>Host Date & Time:</b> ${data.hostDatetime} (${data.hostTimezone})</p>
    `;
  }
}
