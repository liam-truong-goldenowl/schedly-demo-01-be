import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UUIDModule } from '../uuid/uuid.module';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  exports: [UserService],
  providers: [UserService],
  imports: [MikroOrmModule.forFeature([User]), UUIDModule],
})
export class UserModule {}
