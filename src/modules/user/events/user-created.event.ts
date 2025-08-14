export interface UserCreatedPayload {
  id: number;
  timezone: string;
  password: string;
}

export class UserCreatedEvent {
  constructor(public payload: UserCreatedPayload) {}
}
