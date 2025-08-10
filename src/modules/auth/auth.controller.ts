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

import { ConfigService } from '@/config';
import { RequestUser } from '@/common/interfaces';
import { CurrentUser } from '@/decorators/current-user.decorator';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/utils/constants/cookies';

import { UserResDto } from '../user/dto/user-res.dto';

import { LoginDto, SignUpDto, TokenRespDto, SignUpRespDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard, JwtRefreshAuthGuard } from './guards';
import {
  LoginUseCase,
  SignUpUseCase,
  LogoutUseCase,
  GetProfileUseCase,
  RefreshTokensUserCase,
} from './use-cases';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private loginUC: LoginUseCase,
    private signUpUC: SignUpUseCase,
    private logoutUC: LogoutUseCase,
    private getProfileUC: GetProfileUseCase,
    private refreshTokensUc: RefreshTokensUserCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: TokenRespDto })
  async login(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.loginUC.execute(user);
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ type: SignUpRespDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.signUpUC.execute(signUpDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await Promise.all([
      this.logoutUC.execute(user),
      this.clearTokensInCookies(res),
    ]);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @ApiResponse({ type: TokenRespDto })
  async refreshTokens(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.refreshTokensUc.execute(user);
    await this.setTokensInCookies({ res, ...tokens });
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserResDto })
  async me(@CurrentUser() user: RequestUser) {
    return this.getProfileUC.execute(user);
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
    const { isProd } = this.configService.getOrThrow('app');

    const accessExpirationDate = new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN);
    const refreshExpirationDate = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_IN,
    );

    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      secure: isProd,
      httpOnly: true,
      expires: accessExpirationDate,
    });
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      secure: isProd,
      httpOnly: true,
      expires: refreshExpirationDate,
    });
  }

  private async clearTokensInCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_KEY);
    res.clearCookie(REFRESH_TOKEN_KEY);
  }
}
