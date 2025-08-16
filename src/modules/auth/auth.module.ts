import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from './entities/account.entity';
import { LoginUseCase } from './use-cases/login.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { SignUpUseCase } from './use-cases/signup.use-case';
import { RefreshTokensUserCase } from './use-cases/refresh-tokens.use-case';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule,
    UserModule,
    PassportModule,
    MikroOrmModule.forFeature([Account]),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    LoginUseCase,
    LogoutUseCase,
    SignUpUseCase,
    RefreshTokensUserCase,
  ],
})
export class AuthModule {}
