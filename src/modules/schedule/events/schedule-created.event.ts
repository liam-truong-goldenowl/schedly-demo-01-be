export class ScheduleCreatedEvent {
  static readonly name = 'schedule.created';
  constructor(public payload: { id: number }) {}
}
