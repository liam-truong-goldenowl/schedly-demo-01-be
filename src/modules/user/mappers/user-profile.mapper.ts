import { plainToInstance } from 'class-transformer';

import { User } from '../entities/user.entity';
import { UserProfileResDto } from '../dto/res/user-profile-res.dto';

export class UserProfileMapper {
  static toResponse(entity: User): UserProfileResDto {
    return plainToInstance(UserProfileResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
