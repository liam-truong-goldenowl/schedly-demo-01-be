import { Seeder } from '@mikro-orm/seeder';

import type { Dictionary, EntityManager } from '@mikro-orm/core';

import { Schedule } from '@/modules/schedule/entities/schedule.entity';

import { EventFactory } from '../factories/event.factory';

export class EventSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    if (!context.events) {
      context.events = [];
    }

    context.schedules.forEach((schedule: Schedule) => {
      const events = new EventFactory(em).make(2, { user: schedule.user.id });
      schedule.events.set(events);
      context.events.push(...events);
    });
  }
}
