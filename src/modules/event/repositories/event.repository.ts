import { BaseRepository } from '@/common/repositories/base.repository';

import { Event } from '../entities/event.entity';

export class EventRepository extends BaseRepository<Event> {
  async findAllByHostId(hostId: number): Promise<Event[]> {
    return this.find({ user: { id: hostId } });
  }
}
