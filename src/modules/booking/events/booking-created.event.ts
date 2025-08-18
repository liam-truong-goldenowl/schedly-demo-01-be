export class BookingCreatedEvent {
  static readonly name = Symbol.for('booking.created');

  constructor(
    public readonly payload: {
      host: {
        email: string;
        name: string;
        timezone: string;
      };
      invitees: {
        email: string;
        name: string;
      }[];
      inviteeTimezone: string;
      startDate: string;
      startTime: string;
      event: {
        id: number;
        name: string;
        duration: number;
      };
    },
  ) {}
}
