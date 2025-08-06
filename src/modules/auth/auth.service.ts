import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';

import type { IJwtConfig } from '@/config/jwt';
import type { IReqUser } from '@/common/interfaces';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { LoginResDto } from './dto/login-res.dto';
import { TokenResDto } from './dto/token-res.dto';
import { SignUpResDto } from './dto/signup-res.dto';
import { Account } from './entities/account.entity';
import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { SignUpDto } from './dto/signup.dto';
import type { ITokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private em: EntityManager,
    private jwtService: JwtService,
    private userService: UserService,
    private confService: ConfigService,
  ) {}

  async login(attemptUser: IReqUser): Promise<LoginResDto> {
    const tokens = await this.generateTokens(attemptUser);

    await this.updateAccountRefreshToken({
      userId: attemptUser.id,
      refreshToken: tokens.refreshToken,
    });

    return LoginResDto.fromTokens(tokens);
  }

  async signUp(userInfo: SignUpDto): Promise<SignUpResDto> {
    const user = await this.userService.create(userInfo);
    return SignUpResDto.fromUser(user);
  }

  async logout(userId: number): Promise<void> {
    const account = await this.em.findOne(Account, { user: { id: userId } });

    if (!account) {
      throw new WrongCredentialsException();
    }

    await account.revokeRefreshToken();

    await this.em.flush();
  }

  async refreshTokens(user: IReqUser): Promise<TokenResDto> {
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
    });

    await this.updateAccountRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    return TokenResDto.fromTokens(tokens);
  }

  public async validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.em.findOne(User, { email: credentials.email });

    if (!user) {
      throw new WrongCredentialsException();
    }

    const account = await this.em.findOne(Account, {
      user: { id: user.id },
    });

    const isCorrectPassword = await account?.verifyPassword(
      credentials.password,
    );

    if (!isCorrectPassword) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  public async validateJwtUser(credentials: { id: number }): Promise<User> {
    const user = await this.em.findOne(User, { id: credentials.id });

    if (!user) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  public async validateJwtRefreshUser({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<User> {
    const [user, account] = await Promise.all([
      this.em.findOne(User, { id: userId }),
      this.em.findOne(Account, { user: { id: userId } }),
    ]);

    if (!user) {
      throw new WrongCredentialsException();
    }

    const refreshTokenMatches = await account?.verifyRefreshToken(refreshToken);

    if (!refreshTokenMatches) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  private async generateTokens(payload: ITokenPayload) {
    const {
      secret: accessTokenSecret,
      expiresIn: accessTokenExpiresIn,
      refreshSecret: refreshTokenSecret,
      refreshExpiresIn: refreshTokenExpiresIn,
    } = this.confService.getOrThrow<IJwtConfig>('jwt');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateAccountRefreshToken({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<void> {
    const account = await this.em.findOne(Account, { user: { id: userId } });

    await account?.setRefreshToken(refreshToken);

    await this.em.flush();
  }
}
