import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from '../user/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

import { SharingController } from './sharing.controller';
import { GetSharingHostUseCase } from './use-cases/get-sharing-host.use-case';
import { GetSharingEventsUseCase } from './use-cases/get-sharing-events.use-case';

@Module({
  controllers: [SharingController],
  imports: [MikroOrmModule.forFeature([User, Event, Schedule])],
  providers: [GetSharingEventsUseCase, GetSharingHostUseCase],
})
export class SharingModule {}
