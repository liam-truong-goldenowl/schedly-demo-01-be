import { Queue } from 'bull';
import { DateTime } from 'luxon';
import { InjectQueue } from '@nestjs/bull';
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

import { SendReminderJobPayload } from './queue/reminder.job';
import { SendConfirmationEmailJobPayload } from './queue/confirmation.job';

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
    @InjectQueue('reminder')
    private readonly reminderQueue: Queue,
    @InjectQueue('confirmation')
    private readonly confirmationQueue: Queue,
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
        startTime: { $eq: null },
        endTime: { $eq: null },
      }),
    ]);

    if (unavailableOverrides.length > 0) {
      throw new BadRequestException('Date is unavailable');
    }

    if (overrides.length > 0) {
      const overrideTimes = overrides.flatMap(({ startTime, endTime }) =>
        DateTimeHelper.generatePossibleStartTimes(
          startTime!,
          endTime!,
          duration,
        ),
      );

      if (!overrideTimes.includes(time)) {
        throw new BadRequestException('Invalid start time');
      }
      return;
    }

    if (!weeklyHour) {
      throw new BadRequestException('Date is unavailable');
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

  private calculateReminderDelay({
    date,
    time,
  }: {
    date: string;
    time: string;
  }): number {
    const currentDt = DateTime.now();
    const minutesBeforeMeetingReminder = 15;
    const bookingDt = DateTime.fromFormat(
      `${date} ${time}`,
      'yyyy-MM-dd HH:mm',
    ).minus({
      minutes: minutesBeforeMeetingReminder,
    });

    const { milliseconds } = bookingDt.diff(currentDt, ['milliseconds']);

    return Math.max(milliseconds, 0);
  }

  private async scheduleReminder(
    payload: SendReminderJobPayload,
    delayMs: number,
  ): Promise<void> {
    const { person, event, meeting } = payload;

    const jobId = `${person.email}:${event.id}:${meeting.date}:${meeting.time}`;

    await this.reminderQueue.add('send-reminder', payload, {
      jobId,
      delay: delayMs,
      removeOnComplete: true,
    });
  }

  async scheduleMeetingReminders(
    event: { id: number; name: string; date: string; time: string },
    host: { email: string; name: string; timezone: string },
    invitees: { email: string; name: string; timezone: string }[],
  ) {
    const baseDt = DateTime.fromFormat(
      `${event.date} ${event.time}`,
      'yyyy-MM-dd HH:mm',
      { zone: host.timezone },
    );

    if (!baseDt.isValid) {
      throw new Error('Invalid date or time format');
    }

    const delayMs = this.calculateReminderDelay(event);
    const meetingHost = {
      event,
      person: host,
      meeting: {
        date: baseDt.toFormat('yyyy-MM-dd'),
        time: baseDt.toFormat('HH:mm'),
      },
    };
    const meetingInvitees = invitees.map((invitee) => {
      const inviteeDt = baseDt.setZone(invitee.timezone);

      if (!inviteeDt.isValid) {
        throw new Error('Invalid date or time format');
      }

      return {
        event,
        person: invitee,
        meeting: {
          date: inviteeDt.toFormat('yyyy-MM-dd'),
          time: inviteeDt.toFormat('HH:mm'),
        },
      };
    });

    await Promise.all([
      this.scheduleReminder(meetingHost, delayMs),
      ...meetingInvitees.map((invitee) =>
        this.scheduleReminder(invitee, delayMs),
      ),
    ]);
  }

  async scheduleMeetingConfirmationEmails(
    event: { id: number; name: string; timezone: string },
    meeting: { date: string; time: string },
    host: { email: string; name: string; timezone: string },
    invitees: { email: string; name: string; timezone: string }[],
  ) {
    const baseDt = DateTime.fromFormat(
      `${meeting.date} ${meeting.time}`,
      'yyyy-MM-dd HH:mm',
      { zone: host.timezone },
    );

    if (!baseDt.isValid) {
      throw new Error('Invalid date or time format');
    }

    const confirmationPayload: SendConfirmationEmailJobPayload = {
      person: host,
      event,
      meeting: {
        date: baseDt.toFormat('yyyy-MM-dd'),
        time: baseDt.toFormat('HH:mm'),
      },
    };

    await this.scheduleHostConfirmationEmail(confirmationPayload);

    for (const invitee of invitees) {
      const inviteeDt = baseDt.setZone(invitee.timezone);

      if (!inviteeDt.isValid) {
        throw new Error('Invalid date or time format');
      }

      const inviteePayload: SendConfirmationEmailJobPayload = {
        person: invitee,
        event,
        meeting: {
          date: inviteeDt.toFormat('yyyy-MM-dd'),
          time: inviteeDt.toFormat('HH:mm'),
        },
      };

      await this.scheduleInviteeConfirmationEmail(inviteePayload);
    }
  }

  private async scheduleHostConfirmationEmail(
    payload: SendConfirmationEmailJobPayload,
  ) {
    const { person, event, meeting } = payload;

    const jobId = `${person.email}:${event.id}:${meeting.date}:${meeting.time}`;

    await this.confirmationQueue.add('send-host-confirmation', payload, {
      jobId,
      removeOnComplete: true,
    });
  }

  private async scheduleInviteeConfirmationEmail(
    payload: SendConfirmationEmailJobPayload,
  ) {
    const { person, event, meeting } = payload;

    const jobId = `${person.email}:${event.id}:${meeting.date}:${meeting.time}`;

    await this.confirmationQueue.add('send-invitee-confirmation', payload, {
      jobId,
      removeOnComplete: true,
    });
  }
}
