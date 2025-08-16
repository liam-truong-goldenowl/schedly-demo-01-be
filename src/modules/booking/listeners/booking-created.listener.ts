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
    const datetime = DateTime.fromISO(isoDate).toJSDate().toLocaleString();

    const recipient = payload.hostMail;
    const subject = `New Event: ${payload.event.name} - ${datetime}`;
    const body = await this.hostMailTemplate({
      eventName: payload.event.name,
      hostName: payload.hostName,
      datetime: datetime,
      inviteeTimezone: payload.inviteeTimezone,
    });

    await this.mailService.send(recipient, body, subject);
  }

  async hostMailTemplate(data: {
    eventName: string;
    hostName: string;
    datetime: string;
    inviteeTimezone: string;
  }) {
    return `
      <p>Hi ${data.hostName},</p>
      <p>A new event has been scheduled</p>
      <p><b>Event:</b> ${data.eventName}</p>
      <p><b>Date & Time:</b> ${data.datetime}</p>
      <p><b>Invitee Timezone:</b> ${data.inviteeTimezone}</p>
    `;
  }

  async sendMailToInvitee(event: BookingCreatedEvent) {
    const isoDate = `${event.payload.startDate}T${event.payload.startTime}`;
    const datetime = DateTime.fromISO(isoDate, {
      zone: event.payload.hostTimezone,
    })
      .setZone(event.payload.inviteeTimezone)
      .toJSDate()
      .toLocaleString();

    const recipient = event.payload.inviteeMail;
    const subject = `New Event: ${event.payload.event.name} - ${datetime}`;
    const body = await this.inviteeMailTemplate({
      eventName: event.payload.event.name,
      inviteeName: event.payload.inviteeName,
      datetime: datetime,
      hostTimezone: event.payload.hostTimezone,
    });

    await this.mailService.send(recipient, body, subject);
  }

  async inviteeMailTemplate(data: {
    eventName: string;
    inviteeName: string;
    datetime: string;
    hostTimezone: string;
  }) {
    return `
      <p>Hi ${data.inviteeName},</p>
      <p>You have been invited to a new event</p>
      <p><b>Event:</b> ${data.eventName}</p>
      <p><b>Date & Time:</b> ${data.datetime}</p>
      <p><b>Host Timezone:</b> ${data.hostTimezone}</p>
    `;
  }
}
