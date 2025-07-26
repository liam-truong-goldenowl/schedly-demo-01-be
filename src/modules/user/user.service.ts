import { randAlpha } from '@ngneat/falso';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { createPublicSlug } from '@/utils/helpers/strings';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exists';

@Injectable()
export class UserService {
  constructor(
    private em: EntityManager,
    private userRepository: UserRepository,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }

  public async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const { email, name } = dto;

    const emailExists = await this.userRepository.count({ email });

    if (emailExists > 0) {
      throw new UserAlreadyExistsException();
    }

    const publicSlug = await this.createUniquePublicSlug(name);
    const user = new User({ email, name, publicSlug });

    await this.em.persistAndFlush(user);

    return new CreateUserResponseDto(user);
  }

  private async createUniquePublicSlug(name: string): Promise<string> {
    const baseSlug = createPublicSlug(name);
    let candidateSlug = baseSlug;

    let publicSlugExists = await this.userRepository.count({
      publicSlug: candidateSlug,
    });

    // Check for base slug available
    if (publicSlugExists == 0) {
      return candidateSlug;
    }

    // Try appending a random suffix until unique
    do {
      const suffix = randAlpha({ length: 10 }).join('');
      candidateSlug = `${baseSlug}-${suffix}`;
      publicSlugExists = await this.userRepository.count({
        publicSlug: candidateSlug,
      });
    } while (publicSlugExists > 0);

    return candidateSlug;
  }
}
