import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UUIDModule } from '../uuid/uuid.module';

import { Event } from './entities/event.entity';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';

@Module({
  providers: [EventService],
  controllers: [EventController],
  imports: [MikroOrmModule.forFeature([Event]), UUIDModule],
})
export class EventModule {}
