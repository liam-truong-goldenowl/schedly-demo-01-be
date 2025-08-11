import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { generateSlug } from '@/utils/helpers/strings';

import { UUIDService } from '../uuid/uuid.service';
import { User } from '../../database/entities/user.entity';

import { UserResDto } from './dto/user-res.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCreatedEvent } from './events/user-created.event';
import { UserNotFoundException } from './exceptions/user-not-found';
import { UserAlreadyExistsException } from './exceptions/user-already-exists';

@Injectable()
export class UserService {
  constructor(
    private em: EntityManager,
    private uuidService: UUIDService,
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
  }: CreateUserDto): Promise<User> {
    const emailExists = await this.em.count(User, { email });

    if (emailExists > 0) {
      throw new UserAlreadyExistsException();
    }

    const publicSlug = await this.createUniquePublicSlug(name);
    const user = this.em.create(User, { email, name, publicSlug });

    await this.em.flush();

    await this.eventEmitter.emitAsync(
      'user.created',
      new UserCreatedEvent({ id: user.id, timezone, password }),
    );

    return user;
  }

  private async createUniquePublicSlug(name: string): Promise<string> {
    const slug = generateSlug(name);

    const slugExists = await this.em.count(User, { publicSlug: slug });

    if (slugExists > 0) {
      const suffix = await this.uuidService.generate();
      return `${slug}-${suffix}`;
    }

    return slug;
  }
}
