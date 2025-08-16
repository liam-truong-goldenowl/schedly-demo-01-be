import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SlugService } from '@/modules/utils/services/slug.service';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UserCreatedEvent } from './events/user-created.event';
import { UserRepository } from './repositories/user.repository';
import { EmailAlreadyInUseException } from './exceptions/email-already-in-use.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly slugService: SlugService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createUser({
    name,
    email,
    timezone,
    password,
  }: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepo.exists({ email });

    if (emailExists) {
      throw new EmailAlreadyInUseException();
    }

    const slug = await this.slugService.generateUnique(name);
    const user = await this.userRepo.createEntity({ email, name, slug });

    await this.eventEmitter.emitAsync(
      'user.created',
      new UserCreatedEvent({ id: user.id, timezone, password }),
    );

    return user;
  }
}
