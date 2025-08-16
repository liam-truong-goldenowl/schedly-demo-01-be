import { Injectable } from '@nestjs/common';

import { UserService } from '@/modules/user/user.service';

import { SignUpDto } from '../dto/req/signup.dto';
import { SignUpMapper } from '../mappers/signup.mapper';

@Injectable()
export class SignUpUseCase {
  constructor(private userService: UserService) {}

  async execute(input: SignUpDto) {
    const user = await this.userService.createUser(input);
    return SignUpMapper.toResponse(user);
  }
}
