export class UserCreatedEvent {
  constructor(public user: { id: number; timezone: string }) {}
}
