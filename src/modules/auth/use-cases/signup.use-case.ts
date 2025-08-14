import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { UserService } from '@/modules/user/user.service';

import { SignUpDto } from '../dto/signup.dto';
import { SignUpResDto } from '../dto/signup-res.dto';
import { SignUpMapper } from '../mappers/signup.mapper';

@Injectable()
export class SignUpUseCase implements UseCase<SignUpDto, SignUpResDto> {
  constructor(private userService: UserService) {}

  async execute(input: SignUpDto): Promise<SignUpResDto> {
    const user = await this.userService.create(input);
    return SignUpMapper.toResponse(user);
  }
}
