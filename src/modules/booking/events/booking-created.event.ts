export class BookingCreatedEvent {
  static readonly name = Symbol.for('booking.created');

  constructor(
    public readonly payload: {
      hostMail: string;
      hostName: string;
      hostTimezone: string;
      inviteeMail: string;
      inviteeName: string;
      inviteeTimezone: string;
      guestMails: string[];
      startDate: string;
      startTime: string;
      event: {
        id: number;
        name: string;
        duration: number;
        location: string;
      };
    },
  ) {}
}
