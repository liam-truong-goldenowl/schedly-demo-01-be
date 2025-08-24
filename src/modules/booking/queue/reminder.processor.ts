import { Job } from 'bull';
import dedent from 'dedent';
import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

import { MailService } from '@/modules/utils/services/mail.service';

import { SendReminderJobPayload } from './reminder.job';

@Processor('reminder')
@Injectable()
export class ReminderProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-reminder')
  async sendReminderEmail(job: Job<SendReminderJobPayload>) {
    const recipient = job.data.person.email;
    const { subject, html, text } = this.renderReminderEmail(job.data);

    await this.mailService.sendEmail(recipient, subject, { html, text });
  }

  private renderReminderEmail(payload: SendReminderJobPayload) {
    const { person, event, meeting } = payload;
    const dt = DateTime.fromFormat(
      `${meeting.date} ${meeting.time}`,
      'yyyy-MM-dd HH:mm',
      { zone: person.timezone },
    );

    const subject = `Reminder: ${event.name} at ${dt.toFormat('cccc, LLLL dd yyyy HH:mm a')}`;
    const html = dedent`
      <div style="color: #333;">
        <p>Hi ${person.name},</p>
        <p>This is a friendly reminder for your upcoming meeting:</p>
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
            <td style="padding: 4px 0;">${dt.toFormat('HH:mm')} (${person.timezone})</td>
          </tr>
        </table>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br/>Schedly</p>
      </div>
    `;
    const text = dedent`
      Hi ${person.name},

      This is a friendly reminder for your upcoming event:

      Event: ${event.name}
      Date: ${dt.toFormat('yyyy-MM-dd')}
      Time: ${dt.toFormat('HH:mm')} (${person.timezone})

      Best regards,
      Schedly
    `.trim();

    return { subject, html, text };
  }
}
