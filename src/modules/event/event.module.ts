import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Event } from './entities/event.entity';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';

@Module({
  providers: [EventService],
  controllers: [EventController],
  imports: [MikroOrmModule.forFeature([Event])],
})
export class EventModule {}
