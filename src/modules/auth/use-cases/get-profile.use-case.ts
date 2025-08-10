import { Injectable } from '@nestjs/common';

import { UseCase } from '@/common/interfaces/';
import { RequestUser } from '@/common/interfaces';
import { UserService } from '@/modules/user/user.service';
import { UserResDto } from '@/modules/user/dto/user-res.dto';

@Injectable()
export class GetProfileUseCase implements UseCase<RequestUser, UserResDto> {
  constructor(private userService: UserService) {}

  async execute(user: RequestUser): Promise<UserResDto> {
    return this.userService.getUserProfile(user.id);
  }
}
