import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from '@/modules/user/entities/user.entity';
import { Event } from '@/modules/event/entities/event.entity';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { EventRepository } from '@/modules/event/repositories/event.repository';
import { ScheduleRepository } from '@/modules/schedule/repositories/schedule.repository';

import { EventMapper } from '../mappers/event.mapper';
import { SharingEventResDto } from '../dto/res/sharing-event-res.dto';

@Injectable()
export class GetSharingEventsUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    @InjectRepository(Event)
    private readonly eventRepo: EventRepository,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
  ) {}

  async execute(slug: string): Promise<SharingEventResDto[]> {
    const user = await this.userRepo.findOneOrThrow({ slug });
    const schedules = await this.scheduleRepo.findAll({
      fields: ['id'],
      filters: { ownBy: { id: user.id } },
    });
    const scheduleIds = schedules.map((schedule) => schedule.id);
    const events = await this.eventRepo.findAll({
      where: { schedule: { id: { $in: scheduleIds } } },
    });
    return EventMapper.toResponseList(events);
  }
}
