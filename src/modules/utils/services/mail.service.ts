import { createMessage } from '@upyo/core';
import { SmtpTransport } from '@upyo/smtp';
import { Logger, Injectable } from '@nestjs/common';

import { ConfigService } from '@/config';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transport: SmtpTransport;
  private sender: string;

  constructor(private configService: ConfigService) {
    const mailConfig = this.configService.getOrThrow('mail');

    this.sender = mailConfig.sender;
    this.transport = new SmtpTransport(mailConfig);
  }

  async send(recipient: string, body: string, subject: string): Promise<void> {
    const message = createMessage({
      from: this.sender,
      to: recipient,
      subject,
      content: { text: body, html: body },
    });

    const receipt = await this.transport.send(message);

    if (receipt.successful) {
      this.logger.log('Message sent with ID:', receipt.messageId);
    } else {
      this.logger.error('Send failed:', receipt.errorMessages.join(', '));
    }
  }
}
