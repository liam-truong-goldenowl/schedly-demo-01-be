import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { AccountRepository } from './account.repository';
import { TokenResponseDto } from './dto/token-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { SignUpDto } from './dto/signup.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { TokenPayload, LocalStrategy } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private em: EntityManager,
    private jwtService: JwtService,
    private userService: UserService,
    private confService: ConfigService,
    private accountRepository: AccountRepository,
  ) {}

  public async login({ id, email }: LocalStrategy): Promise<LoginResponseDto> {
    const payload: TokenPayload = { id, email };
    const tokens = await this.generateTokens(payload);

    await this.updateAccountRefreshToken({
      userId: id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  public async signUp(userInfo: SignUpDto): Promise<SignUpResponseDto> {
    const user = await this.userService.create(userInfo);
    return new SignUpResponseDto(user);
  }

  public async logout(userId: number): Promise<void> {
    const account = await this.accountRepository.findOne({
      user: { id: userId },
    });

    if (!account) {
      throw new WrongCredentialsException();
    }

    await account.revokeRefreshToken();
    await this.em.flush();
  }

  public async refreshTokens({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<TokenResponseDto> {
    const [user, account] = await Promise.all([
      this.userService.findOneById(userId),
      this.accountRepository.findOne({ user: { id: userId } }),
    ]);

    const isValidRefreshToken = await account?.verifyRefreshToken(refreshToken);

    if (!user || !isValidRefreshToken) {
      throw new WrongCredentialsException();
    }

    const payload: TokenPayload = { id: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);

    await this.updateAccountRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  public async validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userService.findOneByEmail(credentials.email);

    if (!user) {
      throw new WrongCredentialsException();
    }

    const account = await this.accountRepository.findOne({
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

  public async validateJwtUser(credentials: { email: string }): Promise<User> {
    const user = await this.userService.findOneByEmail(credentials.email);

    if (!user) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  public async validateJwtRefreshUser(credentials: {
    userId: User['id'];
    refreshToken: string;
  }): Promise<User> {
    const user = await this.userService.findOneById(credentials.userId);

    if (!user) {
      throw new WrongCredentialsException();
    }

    const account = await this.accountRepository.findOne({
      user: { id: user.id },
    });
    const refreshTokenMatches = await account?.verifyRefreshToken(
      credentials.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  private async generateTokens(payload: TokenPayload) {
    const {
      secret: accessTokenSecret,
      expiresIn: accessTokenExpiresIn,
      refreshSecret: refreshTokenSecret,
      refreshExpiresIn: refreshTokenExpiresIn,
    } = this.confService.getOrThrow<{
      secret: string;
      expiresIn: string;
      refreshSecret: string;
      refreshExpiresIn: string;
    }>('jwt');

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
    const account = await this.accountRepository.findOne({
      user: { id: userId },
    });

    await account?.setRefreshToken(refreshToken);
    await this.em.flush();
  }
}
