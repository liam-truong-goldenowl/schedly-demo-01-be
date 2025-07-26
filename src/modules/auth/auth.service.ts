import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Account } from './entities/account.entity';
import { AccountRepository } from './account.repository';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { SignUpDto } from './dto/signup.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { ITokenPayload, ILocalStrategy } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private em: EntityManager,
    private jwtService: JwtService,
    private userService: UserService,
    private confService: ConfigService,
    private accountRepository: AccountRepository,
  ) {}
  private async generateTokens(payload: ITokenPayload) {
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

  public async login({
    id,
    email,
    publicSlug,
  }: ILocalStrategy): Promise<LoginResponseDto> {
    const payload: ITokenPayload = { email, publicSlug, id };

    const tokens = await this.generateTokens(payload);

    await this.updateAccountRefreshToken({
      userId: id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  public async signUp(userInfo: SignUpDto): Promise<SignUpResponseDto> {
    const user = await this.userService.create(userInfo);
    await this.createAccount({ userId: user.id, password: userInfo.password });
    return new SignUpResponseDto(user);
  }

  public async refreshTokens({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const [user, account] = await Promise.all([
      this.userService.findOneById(userId),
      this.accountRepository.findOne({ user: { id: userId } }),
    ]);

    const isValidRefreshToken = await account?.verifyRefreshToken(refreshToken);

    if (!user || !isValidRefreshToken) {
      throw new WrongCredentialsException();
    }

    const payload: ITokenPayload = {
      id: user.id,
      email: user.email,
      publicSlug: user.publicSlug,
    };
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
    userId: number;
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

  public async createAccount(dto: {
    userId: number;
    password: string;
  }): Promise<void> {
    const { userId, password } = dto;

    const account = this.em.create(Account, { user: userId });
    account.setPassword(password);
    await this.em.flush();
  }

  private async updateAccountRefreshToken({
    userId,
    refreshToken,
  }: {
    userId: User['id'];
    refreshToken: Account['refreshToken'];
  }): Promise<void> {
    const account = await this.accountRepository.findOne({
      user: { id: userId },
    });

    account?.setRefreshToken(refreshToken);
    await account?.hashRefreshToken();
    await this.em.flush();
  }
}
