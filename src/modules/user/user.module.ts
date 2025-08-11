import { Module } from '@nestjs/common';

import { UUIDModule } from '../uuid/uuid.module';

import * as UseCases from './use-cases';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [UUIDModule],
  exports: [UserService],
  providers: [UserService, ...Object.values(UseCases)],
})
export class UserModule {}
