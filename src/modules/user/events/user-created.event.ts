import { BaseEvent } from '@/common/events/base-event.event';

interface UserCreatedPayload {
  id: number;
  timezone: string;
  password: string;
}

export class UserCreatedEvent extends BaseEvent {
  constructor(public payload: UserCreatedPayload) {
    super();
  }

  static override get eventName(): symbol {
    return Symbol.for('user.created');
  }
}
