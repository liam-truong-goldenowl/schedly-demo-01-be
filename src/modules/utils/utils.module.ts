import { Module } from '@nestjs/common';

import { MailService } from './services/mail.service';
import { TimeService } from './services/time.service';
import { SlugService } from './services/slug.service';
import { HashService } from './services/hash.service';
import { UUIDService } from './services/uuid.service';

@Module({
  exports: [MailService, TimeService, SlugService, HashService, UUIDService],
  providers: [MailService, TimeService, SlugService, HashService, UUIDService],
})
export class UtilsModule {}
