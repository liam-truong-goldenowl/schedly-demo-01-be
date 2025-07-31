import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from './entities/account.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserCreatedListener } from './listeners/user-created.listener';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    LocalStrategy,
    JwtRefreshStrategy,
    UserCreatedListener,
  ],
  imports: [
    JwtModule,
    UserModule,
    PassportModule,
    MikroOrmModule.forFeature([Account]),
  ],
})
export class AuthModule {}
