import { Module } from '@nestjs/common';

import { UUIDModule } from '../uuid/uuid.module';

import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';

@Module({
  providers: [EventService],
  controllers: [EventController],
  imports: [UUIDModule],
})
export class EventModule {}
