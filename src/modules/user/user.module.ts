import { Module } from '@nestjs/common';

import { UUIDModule } from '../uuid/uuid.module';

import { UserService } from './user.service';

@Module({
  imports: [UUIDModule],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
