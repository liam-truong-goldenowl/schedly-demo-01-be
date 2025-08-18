import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, BadRequestException } from '@nestjs/common';

import { DateTimeHelper } from '@/common/utils/helpers/datetime.helper';

import { Event } from '../event/entities/event.entity';
import { Meeting } from '../meeting/entities/meeting.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { WeeklyHour } from '../schedule/entities/weekly-hour.entity';
import { DateOverride } from '../schedule/entities/date-override.entity';
import { EventRepository } from '../event/repositories/event.repository';
import { MeetingRepository } from '../meeting/repositories/meeting.repository';
import { ScheduleRepository } from '../schedule/repositories/schedule.repository';
import { WeeklyHourRepository } from '../schedule/repositories/weekly-hour.repository';
import { DateOverrideRepository } from '../schedule/repositories/date-override.repository';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
    @InjectRepository(DateOverride)
    private readonly dateOverrideRepo: DateOverrideRepository,
    @InjectRepository(Event)
    private readonly eventRepo: EventRepository,
    @InjectRepository(Meeting)
    private readonly meetingRepo: MeetingRepository,
  ) {}

  async validateEventStartTime(
    userId: number,
    eventId: number,
    scheduleId: number,
    { time, date, duration }: { time: string; date: string; duration: number },
  ) {
    const schedule = await this.scheduleRepo.findOneOrThrow(scheduleId);
    const weekday = DateTimeHelper.getWeekdayEnum(date);
    const [weeklyHour, overrides, unavailableOverrides] = await Promise.all([
      this.weeklyHourRepo.findOne({ schedule, weekday }),
      this.dateOverrideRepo.find({
        schedule,
        date,
        startTime: { $ne: null },
        endTime: { $ne: null },
      }),
      this.dateOverrideRepo.find({
        schedule,
        date,
        startTime: null,
        endTime: null,
      }),
    ]);

  async findEventOrThrow(eventId: number) {
    const event = await this.em.findOne(
      Event,
      { id: eventId },
      { populate: ['schedule'] },
    );
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const overrideTimes = overrides.flatMap(({ startTime, endTime }) =>
      DateTimeHelper.generatePossibleStartTimes(startTime!, endTime!, duration),
    );

    if (overrides.length > 0 && !overrideTimes.includes(time)) {
      throw new BadRequestException('Invalid start time');
    }

    const weeklyHourTimes = DateTimeHelper.generatePossibleStartTimes(
      weeklyHour.startTime,
      weeklyHour.endTime,
      duration,
    );

    if (!weeklyHourTimes.includes(time)) {
      throw new BadRequestException('Invalid start time');
    }

    const hostSchedules = await this.scheduleRepo.find(
      { user: userId },
      { fields: ['id'] },
    );
    const otherEvents = await this.eventRepo.find(
      {
        schedule: { $in: hostSchedules.map((s) => s.id) },
        id: { $ne: eventId },
      },
      { fields: ['id'] },
    );

    const start = time;
    const end = DateTimeHelper.addMinutes(time, duration);
    const otherMeetings = await this.meetingRepo.find(
      {
        event: { $in: otherEvents.map((e) => e.id) },
        startDate: date,
        startTime: { $gte: start, $lt: end },
      },
      { fields: ['id'] },
    );

    if (otherMeetings.length > 0) {
      throw new BadRequestException('Time slot is unavailable');
    }
  }

  async validateEventLimit(
    eventId: number,
    inviteeLimit: number,
    {
      startTime,
      startDate,
      invitees,
    }: {
      startTime: string;
      startDate: string;
      invitees: number;
    },
  ) {
    const meeting = await this.meetingRepo.findOne(
      { event: eventId, startDate, startTime },
      { populate: ['invitees:ref'] },
    );
    if (meeting && meeting.invitees.length + invitees > inviteeLimit) {
      throw new BadRequestException('Event limit reached');
    }
  }
}
