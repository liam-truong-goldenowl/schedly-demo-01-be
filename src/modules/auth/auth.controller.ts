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

import { Cookies } from '@/common/decorators/cookies.decorator';
import { ReqUser } from '@/common/interfaces/req-user.interface';
import { CurrentUser } from '@/common/decorators/auth/req-user.decorator';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/utils/constants/cookies';

import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponseDto } from './dto/login-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
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
  @ApiResponse({ type: LoginResponseDto })
  async login(
    @CurrentUser() user: ReqUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const tokens = await this.authService.login(user);
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ type: SignUpResponseDto })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: ReqUser,
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
  @ApiResponse({ type: TokenResponseDto })
  async refreshTokens(
    @CurrentUser('id') userId: ReqUser['id'],
    @Res({ passthrough: true }) res: Response,
    @Cookies(REFRESH_TOKEN_KEY) refreshToken: string,
  ): Promise<TokenResponseDto> {
    const tokens = await this.authService.refreshTokens({
      userId,
      refreshToken,
    });
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserResponseDto })
  public async me(
    @CurrentUser('id') userId: ReqUser['id'],
  ): Promise<UserResponseDto> {
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
