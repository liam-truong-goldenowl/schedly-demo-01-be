import { Type, Expose } from 'class-transformer';

class Event {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  inviteeLimit: number;

  @Expose()
  duration: number;
}

class Invitee {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  timezone: string;
}

export class MeetingResDto {
  @Expose()
  id: number;

  @Expose()
  note: string | null;

  @Expose()
  startDate: string;

  @Expose()
  startTime: string;

  @Expose()
  timezone: string;

  @Type(() => Event)
  @Expose()
  event: Event;

  @Type(() => Invitee)
  @Expose()
  invitees: Invitee[];
}
