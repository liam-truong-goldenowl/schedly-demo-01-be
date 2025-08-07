import { Module } from '@nestjs/common';

import { SharingController } from './controllers/sharing.controller';
import { GetSharingHostUseCase } from './use-cases/get-sharing-host.use-case';

@Module({
  controllers: [SharingController],
  providers: [GetSharingHostUseCase],
})
export class SharingModule {}
