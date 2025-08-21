import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UserCreatedEvent } from './events/user-created.event';
import { UserRepository } from './repositories/user.repository';
import { EmailAlreadyInUseException } from './exceptions/email-already-in-use.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
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
    const user = await this.userRepo.createEntity({ email, name });
    await this.eventEmitter.emitAsync(
      UserCreatedEvent.name,
      new UserCreatedEvent({ id: user.id, timezone, password }),
    );
    return user;
  }
}
