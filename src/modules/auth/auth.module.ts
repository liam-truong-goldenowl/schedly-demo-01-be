import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from './entities/account.entity';
import { LoginUseCase } from './use-cases/login.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { SignUpUseCase } from './use-cases/signup.use-case';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokensUserCase } from './use-cases/refresh-tokens.use-case';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule,
    UserModule,
    PassportModule,
    MikroOrmModule.forFeature([Account, User]),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    LoginUseCase,
    LogoutUseCase,
    SignUpUseCase,
    RefreshTokensUserCase,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    LocalAuthGuard,
    JwtAccessAuthGuard,
    JwtRefreshAuthGuard,
  ],
})
export class AuthModule {}
