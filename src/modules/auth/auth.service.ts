import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@/config/config.service';
import { User } from '@/modules/user/entities/user.entity';

import { UserRepository } from '../user/repositories/user.repository';

import { TokenDto } from './dto/req/token.dto';
import { Account } from './entities/account.entity';
import { TokenPayload } from './interfaces/token-payload.interface';
import { AccountRepository } from './repositories/account.repository';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: AccountRepository,
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOneOrThrow({ email });
    const account = await this.accountRepo.findOneOrThrow({ user });

    const isCorrectPassword = await account.verifyPassword(password);
    if (!isCorrectPassword) {
      throw new WrongCredentialsException();
    }

    return user;
  }

  async validateJwtUser(userId: number): Promise<User> {
    return await this.userRepo.findOneOrThrow({ id: userId });
  }

  async validateJwtRefreshUser(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const [user, account] = await Promise.all([
      this.userRepo.findOneOrThrow({ id: userId }),
      this.accountRepo.findOneOrThrow({ user: { id: userId } }),
    ]);

    const isCorrectToken = await account.verifyRefreshToken(refreshToken);
    if (!isCorrectToken) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async generateTokens(payload: TokenPayload): Promise<TokenDto> {
    const { secret, expiresIn, refreshSecret, refreshExpiresIn } =
      this.configService.getOrThrow('jwt');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret, expiresIn }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async resetToken(userId: number, refreshToken: string) {
    await this.accountRepo.setRefreshToken(userId, refreshToken);
  }

  async unsetToken(userId: number) {
    await this.accountRepo.unsetRefreshToken(userId);
  }
}
