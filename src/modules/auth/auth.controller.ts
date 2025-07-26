import { Body, Post, UseGuards, Controller } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/auth/req-user.decorator';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ILocalStrategy } from './auth.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: ILocalStrategy): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }
}
