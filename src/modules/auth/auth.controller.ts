import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Res,
  Body,
  Post,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import type { Response } from 'express';

import { IReqUser } from '@/common/interfaces';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/common/constants/cookies';

import { UserService } from '../user/user.service';
import { UserResDto } from '../user/dto/user-res.dto';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginResDto } from './dto/login-res.dto';
import { TokenResDto } from './dto/token-res.dto';
import { SignUpResDto } from './dto/signup-res.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: LoginResDto })
  async login(
    @CurrentUser() user: IReqUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResDto> {
    const tokens = await this.authService.login(user);
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ type: SignUpResDto })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: IReqUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await Promise.all([
      this.clearTokensInCookies(res),
      this.authService.logout(user.id),
    ]);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @ApiResponse({ type: TokenResDto })
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: IReqUser,
  ): Promise<TokenResDto> {
    const tokens = await this.authService.refreshTokens(user);
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserResDto })
  async me(@CurrentUser('id') userId: IReqUser['id']): Promise<UserResDto> {
    return this.userService.getUserProfile(userId);
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
    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN),
    });
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
    });
  }

  private async clearTokensInCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_KEY);
    res.clearCookie(REFRESH_TOKEN_KEY);
  }
}
