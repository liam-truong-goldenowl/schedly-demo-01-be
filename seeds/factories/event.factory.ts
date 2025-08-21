import { Factory } from '@mikro-orm/seeder';
import {
  randQuote,
  randNumber,
  randSports,
  randJobArea,
  randChanceBoolean,
} from '@ngneat/falso';

import { Event } from '@/modules/event/entities/event.entity';

export class EventFactory extends Factory<Event> {
  model = Event;

  definition(): Partial<Event> {
    const chance = randChanceBoolean({ chanceTrue: 0.5 });
    const events = [
      'Training',
      'Meeting',
      'Conference',
      'Webinar',
      'Team Building',
    ];
    const randEvent = events[Math.floor(Math.random() * events.length)];
    const name = chance
      ? `${randSports()} ${randEvent}`
      : `${randJobArea()} ${randEvent}`;

    return {
      name,
      duration: randNumber({ min: 30, max: 120, precision: 15 }),
      inviteeLimit: randNumber({ min: 1, max: 20, precision: 5 }),
      description: randQuote({ maxCharCount: 255 }),
    };
  }
}
