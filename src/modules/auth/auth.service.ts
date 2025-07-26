import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Account } from './entities/account.entity';
import { AccountRepository } from './account.repository';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { LoginDto } from './dto/login.dto';
import type { SignUpDto } from './dto/signup.dto';
import type { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private accountRepository: AccountRepository,
    private em: EntityManager,
  ) {}

  public async login(userInfo: LoginDto): Promise<LoginResponseDto> {
    const payload = { username: userInfo.email, sub: userInfo.password };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  public async signUp(userInfo: SignUpDto): Promise<SignUpResponseDto> {
    const user = await this.userService.create(userInfo);

    await this.createAccount({ userId: user.id, password: userInfo.password });

    return new SignUpResponseDto(user);
  }

  public async validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userService.findOneByEmail(credentials.email);

    if (!user) {
      throw new WrongCredentialsException();
    }

    const account = await this.findAccountByUserId(user.id);

    const isCorrectPassword = await account?.verifyPassword(
      credentials.password,
    );

    if (!isCorrectPassword) {
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

  private async findAccountByUserId(userId: number) {
    return this.accountRepository.findOne({ user: { id: userId } });
  }
}
