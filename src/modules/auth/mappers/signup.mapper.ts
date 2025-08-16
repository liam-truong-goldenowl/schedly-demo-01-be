import { plainToInstance } from 'class-transformer';

import { User } from '@/modules/user/entities/user.entity';

import { SignUpResDto } from '../dto/res/signup-res.dto';

export class SignUpMapper {
  static toResponse(entity: User): SignUpResDto {
    return plainToInstance(SignUpResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
