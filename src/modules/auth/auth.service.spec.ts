import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { UnauthorizedException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { ConfigService } from '@/config/config.service';
import { User } from '@/modules/user/entities/user.entity';

import { UserRepository } from '../user/repositories/user.repository';

import { AuthService } from './auth.service';
import { Account } from './entities/account.entity';
import { AccountRepository } from './repositories/account.repository';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let accountRepo: DeepMocked<AccountRepository>;
  let userRepo: DeepMocked<UserRepository>;
  let jwtService: DeepMocked<JwtService>;
  let configService: DeepMocked<ConfigService>;

  const mockUser = { id: 1, email: 'test@example.com' } as User;
  const mockAccount = createMock<Account>({
    verifyPassword: jest.fn(),
    verifyRefreshToken: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Account),
          useValue: createMock<AccountRepository>({
            findOneOrThrow: jest.fn(),
            setRefreshToken: jest.fn(),
            unsetRefreshToken: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<UserRepository>({
            findOneOrThrow: jest.fn(),
          }),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>({
            signAsync: jest.fn(),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            getOrThrow: jest.fn(),
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    accountRepo = module.get(getRepositoryToken(Account));
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      userRepo.findOneOrThrow.mockResolvedValue(mockUser);
      accountRepo.findOneOrThrow.mockResolvedValue(mockAccount);
      mockAccount.verifyPassword.mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(userRepo.findOneOrThrow).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(accountRepo.findOneOrThrow).toHaveBeenCalledWith({
        user: mockUser,
      });
      expect(mockAccount.verifyPassword).toHaveBeenCalledWith('password');
      expect(result).toEqual(mockUser);
    });

    it('should throw WrongCredentialsException if password is invalid', async () => {
      userRepo.findOneOrThrow.mockResolvedValue(mockUser);
      accountRepo.findOneOrThrow.mockResolvedValue(mockAccount);
      mockAccount.verifyPassword.mockResolvedValue(false);

      await expect(
        authService.validateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(WrongCredentialsException);
    });
  });

  describe('validateJwtUser', () => {
    it('should return user if found by id', async () => {
      userRepo.findOneOrThrow.mockResolvedValue(mockUser);

      const result = await authService.validateJwtUser(1);

      expect(userRepo.findOneOrThrow).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateJwtRefreshUser', () => {
    it('should return user if refresh token is valid', async () => {
      userRepo.findOneOrThrow.mockResolvedValue(mockUser);
      accountRepo.findOneOrThrow.mockResolvedValue(mockAccount);
      mockAccount.verifyRefreshToken.mockResolvedValue(true);

      const result = await authService.validateJwtRefreshUser(
        1,
        'refresh-token',
      );

      expect(userRepo.findOneOrThrow).toHaveBeenCalledWith({ id: 1 });
      expect(accountRepo.findOneOrThrow).toHaveBeenCalledWith({
        user: { id: 1 },
      });
      expect(mockAccount.verifyRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      userRepo.findOneOrThrow.mockResolvedValue(mockUser);
      accountRepo.findOneOrThrow.mockResolvedValue(mockAccount);
      mockAccount.verifyRefreshToken.mockResolvedValue(false);

      await expect(
        authService.validateJwtRefreshUser(1, 'invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const jwtConfig = {
        secret: 'test-secret',
        expiresIn: '15m',
        refreshSecret: 'refresh-secret',
        refreshExpiresIn: '7d',
      };

      configService.getOrThrow.mockReturnValue(jwtConfig);
      jwtService.signAsync.mockResolvedValueOnce('access-token');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token');

      const payload = { id: 1, email: 'test@example.com' };
      const result = await authService.generateTokens(payload);

      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshExpiresIn,
      });
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('resetToken', () => {
    it('should call accountRepo.setRefreshToken with userId and refreshToken', async () => {
      accountRepo.setRefreshToken.mockResolvedValue(undefined);

      await authService.resetToken(1, 'new-refresh-token');

      expect(accountRepo.setRefreshToken).toHaveBeenCalledWith(
        1,
        'new-refresh-token',
      );
    });
  });

  describe('unsetToken', () => {
    it('should call accountRepo.unsetRefreshToken with userId', async () => {
      accountRepo.unsetRefreshToken.mockResolvedValue(undefined);

      await authService.unsetToken(1);

      expect(accountRepo.unsetRefreshToken).toHaveBeenCalledWith(1);
    });
  });
});
