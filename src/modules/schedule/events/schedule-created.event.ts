import { Schedule } from '../entities/schedule.entity';

export class ScheduleCreatedEvent {
  constructor(public schedule: { id: Schedule['id'] }) {}
}
