import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { Schedule } from '../schedule/entities/schedule.entity';

import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { ListEventsUseCase } from './use-cases/list-events.use-case';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { ReadEventDetailsUseCase } from './use-cases/read-event-details.use-case';

@Module({
  controllers: [EventController],
  imports: [
    MikroOrmModule.forFeature([Event, Schedule]),
    UtilsModule,
    AuthModule,
  ],
  providers: [ListEventsUseCase, CreateEventUseCase, ReadEventDetailsUseCase],
})
export class EventModule {}
