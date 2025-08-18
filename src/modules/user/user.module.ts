import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UtilsModule } from '../utils/utils.module';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';

@Module({
  controllers: [UserController],
  imports: [UtilsModule, MikroOrmModule.forFeature([User])],
  exports: [UserService],
  providers: [UserService, GetUserProfileUseCase],
})
export class UserModule {}
