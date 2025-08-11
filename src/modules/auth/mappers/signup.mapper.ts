import { plainToInstance } from 'class-transformer';

import { User } from '@/database/entities/user.entity';

import { SignUpResDto } from '../dto/signup-res.dto';

export class SignUpMapper {
  static toResponse(input: User): SignUpResDto {
    return plainToInstance(SignUpResDto, input, {
      excludeExtraneousValues: true,
    });
  }
}
