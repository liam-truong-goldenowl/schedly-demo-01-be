import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';

import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventRepository } from './repositories/event.repository';
import { ListEventsUseCase } from './use-cases/list-events.use-case';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { DeleteEventUseCase } from './use-cases/delete-event.use-case';
import { ReadEventDetailsUseCase } from './use-cases/read-event-details.use-case';

@Module({
  controllers: [EventController],
  imports: [MikroOrmModule.forFeature([Event]), UtilsModule, AuthModule],
  exports: [EventRepository],
  providers: [
    EventRepository,
    ListEventsUseCase,
    CreateEventUseCase,
    DeleteEventUseCase,
    ReadEventDetailsUseCase,
  ],
})
export class EventModule {}
