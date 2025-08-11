import { Module } from '@nestjs/common';

import { UUIDModule } from '../uuid/uuid.module';

import * as UseCases from './use-cases';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  controllers: [EventController],
  imports: [UUIDModule],
  providers: [EventService, ...Object.values(UseCases)],
})
export class EventModule {}
