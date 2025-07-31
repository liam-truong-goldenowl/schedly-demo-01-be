export class UserCreatedEvent {
  constructor(
    public payload: { id: number; timezone: string; password: string },
  ) {}
}
