import { plainToInstance } from 'class-transformer';

import { User } from '@/database/entities/user.entity';

import { SignUpRespDto } from '../dto/signup-resp.dto';

export class SignUpMapper {
  static toResponse(input: User): SignUpRespDto {
    return plainToInstance(SignUpRespDto, input, {
      excludeExtraneousValues: true,
    });
  }
}
