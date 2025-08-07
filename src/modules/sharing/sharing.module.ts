import { Module } from '@nestjs/common';

import { SharingController } from './controllers/sharing.controller';
import { GetSharingHostUseCase } from './use-cases/get-sharing-host.use-case';
import { GetSharingEventsUseCase } from './use-cases/get-sharing-events.use-case';

@Module({
  controllers: [SharingController],
  providers: [GetSharingHostUseCase, GetSharingEventsUseCase],
})
export class SharingModule {}
