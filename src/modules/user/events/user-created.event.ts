export class UserCreatedEvent {
  static readonly name = Symbol.for('user.created');
  constructor(
    public payload: {
      id: number;
      timezone: string;
      password: string;
    },
  ) {}
}
