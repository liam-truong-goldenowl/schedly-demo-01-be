import { Job } from 'bull';
import dedent from 'dedent';
import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

import { MailService } from '@/modules/utils/services/mail.service';

import { SendConfirmationEmailJobPayload } from './confirmation.job';

@Processor('confirmation')
@Injectable()
export class ConfirmationProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-host-confirmation')
  async sendHostConfirmationEmail(job: Job<SendConfirmationEmailJobPayload>) {
    const { data } = job;

    const recipient = data.person.email;
    const { subject, html, text } = this.renderHostConfirmationEmail(data);

    await this.mailService.sendEmail(recipient, subject, { html, text });
  }

  private renderHostConfirmationEmail(
    payload: SendConfirmationEmailJobPayload,
  ) {
    const { person, event, meeting } = payload;

    const dt = DateTime.fromFormat(
      `${meeting.date} ${meeting.time}`,
      'yyyy-MM-dd HH:mm',
      { zone: person.timezone },
    );

    const subject = `New Meeting: ${event.name} at ${dt.toFormat('cccc, LLLL dd yyyy HH:mm a')}`;
    const html = dedent`
      <div style="color: #333;">
        <p>Hi ${person.name},</p>
        <p>A new event has been scheduled:</p>
        <table>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Event</strong></td>
            <td style="padding: 4px 0;">${event.name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Date</strong></td>
            <td style="padding: 4px 0;">${dt.toFormat('yyyy-MM-dd')}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Time</strong></td>
            <td style="padding: 4px 0;">${dt.toFormat('HH:mm (z)')}</td>
          </tr>
        </table>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br/>Schedly</p>
      </div>
    `;
    const text = dedent`
      Hi ${person.name},

      A new event has been scheduled:

      Event: ${event.name}
      Date: ${dt.toFormat('yyyy-MM-dd')}
      Time: ${dt.toFormat('HH:mm (z)')}

      Best regards,
      Schedly
    `.trim();

    return { subject, html, text };
  }

  @Process('send-invitee-confirmation')
  async sendInviteeConfirmationEmail(
    job: Job<SendConfirmationEmailJobPayload>,
  ) {
    const { data } = job;

    const recipient = data.person.email;
    const { subject, html, text } = this.renderInviteeConfirmationEmail(data);

    await this.mailService.sendEmail(recipient, subject, { html, text });
  }

  private renderInviteeConfirmationEmail(
    payload: SendConfirmationEmailJobPayload,
  ) {
    const { person, event, meeting } = payload;

    const dt = DateTime.fromFormat(
      `${meeting.date} ${meeting.time}`,
      'yyyy-MM-dd HH:mm',
      { zone: person.timezone },
    );

    const subject = `New Meeting: ${event.name} at ${dt.toFormat('cccc, LLLL dd yyyy HH:mm a')}`;
    const html = dedent`
      <div style="color: #333;">
        <p>Hi ${person.name},</p>
        <p>You have been invited to a new event:</p>
        <table>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Event</strong></td>
            <td style="padding: 4px 0;">${event.name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Date</strong></td>
            <td style="padding: 4px 0;">${dt.toFormat('yyyy-MM-dd')}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px 4px 0;"><strong>Time</strong></td>
            <td style="padding: 4px 0;">${dt.toFormat('HH:mm (z)')}</td>
          </tr>
        </table>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br/>Schedly</p>
      </div>
    `;
    const text = dedent`
      Hi ${person.name},

      You have been invited to a new event:

      Event: ${event.name}
      Date: ${dt.toFormat('yyyy-MM-dd')}
      Time: ${dt.toFormat('HH:mm (z)')}

      Best regards,
      Schedly
    `.trim();

    return { subject, html, text };
  }
}
