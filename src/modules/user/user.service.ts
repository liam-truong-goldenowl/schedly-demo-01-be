import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Account } from '../auth/entities/account.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { WeeklyHour } from '../schedule/entities/weekly-hour.entity';
import { AccountRepository } from '../auth/repositories/account.repository';
import { ScheduleRepository } from '../schedule/repositories/schedule.repository';
import { WeeklyHourRepository } from '../schedule/repositories/weekly-hour.repository';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { EmailAlreadyInUseException } from './exceptions/email-already-in-use.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,

    @InjectRepository(Account)
    private readonly accountRepo: AccountRepository,

    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,

    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { name, email, password, timezone } = dto;
    const emailExists = await this.userRepo.exists({ email });
    if (emailExists) {
      throw new EmailAlreadyInUseException();
    }
    const user = await this.userRepo.createEntity({ email, name });
    const [, schedule] = await Promise.all([
      this.accountRepo.createEntity({ user, password }),
      this.scheduleRepo.createDefaultEntity(user.id, timezone),
    ]);
    await this.weeklyHourRepo.createDefaultEntities(schedule.id);
    return user;
  }
}
