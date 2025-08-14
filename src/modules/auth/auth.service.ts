import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EntityManager, NotFoundError } from '@mikro-orm/core';

import { ConfigService } from '@/config';
import { User } from '@/database/entities/user.entity';
import { Account } from '@/database/entities/account.entity';

import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { TokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private em: EntityManager,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.em.findOne(User, { email });

    if (!user) {
      throw new WrongCredentialsException();
    }

    const account = await this.em.findOne(Account, {
      user: { id: user.id },
    });

    const isCorrectPassword = await account?.verifyPassword(password);

    if (!isCorrectPassword) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  async validateJwtUser(userId: number): Promise<User> {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  async validateJwtRefreshUser({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }): Promise<User> {
    try {
      const [user, account] = await Promise.all([
        this.em.findOneOrFail(User, { id: userId }),
        this.em.findOneOrFail(Account, { user: { id: userId } }),
      ]);

      const isCorrectToken = await account.verifyRefreshToken(refreshToken);

      if (!isCorrectToken) {
        throw new WrongCredentialsException();
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new WrongCredentialsException();
      }

      throw error;
    }
  }

  async generateTokens(payload: TokenPayload) {
    const {
      secret: accessTokenSecret,
      expiresIn: accessTokenExpiresIn,
      refreshSecret: refreshTokenSecret,
      refreshExpiresIn: refreshTokenExpiresIn,
    } = this.configService.getOrThrow('jwt');

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

  async updateAccountRefreshToken({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const account = await this.em.findOneOrFail(Account, {
      user: { id: userId },
    });
    await account.setRefreshToken(refreshToken);
    await this.em.flush();
  }

  async unsetRefreshToken(userId: number) {
    const account = await this.em.findOneOrFail(Account, {
      user: { id: userId },
    });
    await account.revokeRefreshToken();
    await this.em.flush();
  }
}
