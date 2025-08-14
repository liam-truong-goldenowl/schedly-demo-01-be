import { Module } from '@nestjs/common';

import { MailService } from './services/mail.service';

@Module({
  exports: [MailService],
  providers: [MailService],
})
export class UtilsModule {}
