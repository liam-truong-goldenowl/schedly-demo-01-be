import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { RequestUser } from '@/common/interfaces/request-user.interface';

import { SignUpDto } from './dto/req/signup.dto';
import { AuthController } from './auth.controller';
import { TokenResDto } from './dto/res/token-res.dto';
import { SignUpResDto } from './dto/res/signup-res.dto';
import { LoginUseCase } from './use-cases/login.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { SignUpUseCase } from './use-cases/signup.use-case';
import { RefreshTokensUserCase } from './use-cases/refresh-tokens.use-case';

describe('AuthController', () => {
  let authController: AuthController;
  let loginUC: DeepMocked<LoginUseCase>;
  let signUpUC: DeepMocked<SignUpUseCase>;
  let logoutUC: DeepMocked<LogoutUseCase>;
  let refreshTokensUC: DeepMocked<RefreshTokensUserCase>;

  const mockUser: RequestUser = { id: 1, email: 'test@example.com' };
  const mockTokens: TokenResDto = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };
  const mockSignUpDto: SignUpDto = {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    timezone: 'UTC',
  };
  const mockSignUpResDto: SignUpResDto = {
    email: 'test@example.com',
    name: 'Test User',
    slug: 'test-user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
    loginUC = module.get(LoginUseCase);
    signUpUC = module.get(SignUpUseCase);
    logoutUC = module.get(LogoutUseCase);
    refreshTokensUC = module.get(RefreshTokensUserCase);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call loginUC.execute with user and return tokens', async () => {
      loginUC.execute.mockResolvedValue(mockTokens);

      const result = await authController.login(mockUser);

      expect(loginUC.execute).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('signUp', () => {
    it('should call signUpUC.execute with body and return user data', async () => {
      signUpUC.execute.mockResolvedValue(mockSignUpResDto);

      const result = await authController.signUp(mockSignUpDto);

      expect(signUpUC.execute).toHaveBeenCalledWith(mockSignUpDto);
      expect(result).toEqual(mockSignUpResDto);
    });
  });

  describe('logout', () => {
    it('should call logoutUC.execute with user', async () => {
      logoutUC.execute.mockResolvedValue(undefined);

      await authController.logout(mockUser);

      expect(logoutUC.execute).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refreshTokens', () => {
    it('should call refreshTokensUC.execute with user and return tokens', async () => {
      refreshTokensUC.execute.mockResolvedValue(mockTokens);

      const result = await authController.refreshTokens(mockUser);

      expect(refreshTokensUC.execute).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });
  });
});
