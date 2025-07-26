import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { createPublicSlug } from '@/utils/helpers/strings';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Account } from './entities/account.entity';
import { AccountRepository } from './account.repository';
import { WrongCredentialsException } from './exceptions/wrong-credentials';

import type { LoginDto } from './dto/login.dto';
import type { SignUpDto } from './dto/signup.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { SignUpResponseDto } from './dto/signup-response.dto';

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
    const { email, name, password } = userInfo;

    const publicSlug = createPublicSlug(name);

    const user = await this.userService.create(userInfo);

    await this.createAccount({ userId: user.id, password });

    return { email, name, publicSlug };
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

    console.log(account);

    return user;
  }

  public async createAccount(dto: {
    userId: number;
    password: string;
  }): Promise<void> {
    const { userId, password } = dto;
    const passwordHash = password; // TODO: Implement password hashing

    this.em.create(Account, {
      user: userId,
      passwordHash,
    });

    await this.em.flush();
  }

  private async findAccountByUserId(userId: number) {
    return this.accountRepository.findOne({ user: { id: userId } });
  }
}
