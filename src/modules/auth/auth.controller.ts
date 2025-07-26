import { ApiBody } from '@nestjs/swagger';
import { Res, Body, Post, UseGuards, Controller } from '@nestjs/common';

import type { Response } from 'express';

import { Cookies } from '@/common/decorators/cookies.decorator';
import { CurrentUser } from '@/common/decorators/auth/req-user.decorator';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

import type { ILocalStrategy } from './auth.interface';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { SignUpResponseDto } from './dto/signup-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @CurrentUser() user: ILocalStrategy,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const tokens = await this.authService.login(user);

    await this.setTokensInCookies({
      res,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  async refreshTokens(
    @CurrentUser() user: ILocalStrategy,
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userId = user.id;
    const tokens = await this.authService.refreshTokens({
      userId,
      refreshToken,
    });

    await this.setTokensInCookies({
      res,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  private async setTokensInCookies({
    res,
    accessToken,
    refreshToken,
  }: {
    res: Response;
    accessToken: string;
    refreshToken: string;
  }) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  }
}
