import { BaseEvent } from '@/common/events/base-event.event';

interface ScheduleCreatedPayload {
  id: number;
}

export class ScheduleCreatedEvent extends BaseEvent {
  constructor(public payload: ScheduleCreatedPayload) {
    super();
  }

  static override get eventName(): symbol {
    return Symbol.for('schedule.created');
  }
}
