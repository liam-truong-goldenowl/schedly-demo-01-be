import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Post,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { RequestUser } from '@/common/interfaces/request-user.interface';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { LoginDto } from './dto/req/login.dto';
import { SignUpDto } from './dto/req/signup.dto';
import { TokenResDto } from './dto/res/token-res.dto';
import { SignUpResDto } from './dto/res/signup-res.dto';
import { LoginUseCase } from './use-cases/login.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { SignUpUseCase } from './use-cases/signup.use-case';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { RefreshTokensUserCase } from './use-cases/refresh-tokens.use-case';
import { SetTokensInterceptor } from './interceptors/set-tokens.interceptor';
import { UnsetTokensInterceptor } from './interceptors/unset-tokens.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private loginUC: LoginUseCase,
    private signUpUC: SignUpUseCase,
    private logoutUC: LogoutUseCase,
    private refreshTokensUC: RefreshTokensUserCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetTokensInterceptor)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: [TokenResDto] })
  async login(@CurrentUser() user: RequestUser): Promise<TokenResDto> {
    return await this.loginUC.execute(user);
  }

  @Post('signup')
  @ApiResponse({ type: SignUpResDto })
  async signUp(@Body() body: SignUpDto): Promise<SignUpResDto> {
    return this.signUpUC.execute(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessAuthGuard)
  @UseInterceptors(UnsetTokensInterceptor)
  async logout(@CurrentUser() user: RequestUser): Promise<void> {
    await this.logoutUC.execute(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(SetTokensInterceptor)
  async refreshTokens(@CurrentUser() user: RequestUser): Promise<TokenResDto> {
    return await this.refreshTokensUC.execute(user);
  }
}
