import { Injectable } from '@nestjs/common';

import { EventRepository } from '../repositories/event.repository';

@Injectable()
export class DeleteEventUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute(userId: number, eventId: number) {
    await this.eventRepo.deleteEntity({ id: eventId, user: userId });
  }
}
