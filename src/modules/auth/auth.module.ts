import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';

import * as UseCases from './use-cases';
import * as Listeners from './listeners';
import * as Strategies from './strategies';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [JwtModule, UserModule, PassportModule],
  exports: [AuthService],
  providers: [
    AuthService,
    ...Object.values(UseCases),
    ...Object.values(Listeners),
    ...Object.values(Strategies),
  ],
})
export class AuthModule {}
