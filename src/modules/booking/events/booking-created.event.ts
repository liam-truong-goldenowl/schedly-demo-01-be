export interface BookingCreatedEventPayload {
  hostMail: string;
  hostName: string;
  hostTimezone: string;
  inviteeMail: string;
  inviteeName: string;
  inviteeTimezone: string;
  guestMails: string[];
  startDate: string;
  startTime: string;
  event: BookingEvent;
}

interface BookingEvent {
  id: number;
  name: string;
  duration: number;
  location: string;
}

export class BookingCreatedEvent {
  static readonly name = Symbol.for('booking.created');

  constructor(public readonly payload: BookingCreatedEventPayload) {}
}
