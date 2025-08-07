import { randAlpha } from '@ngneat/falso';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { generateSlug } from '@/utils/helpers/strings';

import { User } from './entities/user.entity';
import { UserResDto } from './dto/user-res.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResDto } from './dto/create-user-res.dto';
import { UserCreatedEvent } from './events/user-created.event';
import { UserNotFoundException } from './exceptions/user-not-found';
import { UserAlreadyExistsException } from './exceptions/user-already-exists';

@Injectable()
export class UserService {
  constructor(
    private em: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUserProfile(id: number): Promise<UserResDto> {
    const user = await this.em.findOne(User, { id });

    if (!user) {
      throw new UserNotFoundException();
    }

    return UserResDto.fromEntity(user);
  }

  async create({
    email,
    name,
    timezone,
    password,
  }: CreateUserDto): Promise<CreateUserResDto> {
    const emailExists = await this.em.count(User, { email });

    if (emailExists > 0) {
      throw new UserAlreadyExistsException();
    }

    const publicSlug = await this.createUniquePublicSlug(name);
    const user = this.em.create(User, { email, name, publicSlug });

    await this.em.flush();

    await this.eventEmitter.emitAsync(
      UserCreatedEvent.eventName,
      new UserCreatedEvent({ id: user.id, timezone, password }),
    );

    return CreateUserResDto.fromEntity(user);
  }

  private async createUniquePublicSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let candidateSlug = baseSlug;

    let publicSlugExists = await this.em.count(User, {
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

      publicSlugExists = await this.em.count(User, {
        publicSlug: candidateSlug,
      });
    } while (publicSlugExists > 0);

    return candidateSlug;
  }
}
