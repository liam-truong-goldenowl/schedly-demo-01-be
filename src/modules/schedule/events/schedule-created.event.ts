export interface ScheduleCreatedPayload {
  id: number;
}

export class ScheduleCreatedEvent {
  constructor(public payload: ScheduleCreatedPayload) {}
}
