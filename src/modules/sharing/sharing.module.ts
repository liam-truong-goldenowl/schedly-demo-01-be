import { Module } from '@nestjs/common';

import * as UseCases from './use-cases';
import { SharingController } from './sharing.controller';

@Module({
  controllers: [SharingController],
  providers: [...Object.values(UseCases)],
})
export class SharingModule {}
