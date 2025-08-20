import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Event } from '@/modules/event/entities/event.entity';
import { Meeting } from '@/modules/meeting/entities/meeting.entity';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';
import { DateTimeHelper } from '@/common/utils/helpers/datetime.helper';
import { WeeklyHour } from '@/modules/schedule/entities/weekly-hour.entity';
import { EventRepository } from '@/modules/event/repositories/event.repository';
import { DateOverride } from '@/modules/schedule/entities/date-override.entity';
import { MeetingRepository } from '@/modules/meeting/repositories/meeting.repository';
import { ScheduleRepository } from '@/modules/schedule/repositories/schedule.repository';
import { WeeklyHourRepository } from '@/modules/schedule/repositories/weekly-hour.repository';
import { DateOverrideRepository } from '@/modules/schedule/repositories/date-override.repository';

import { ListTimeSlotsQueryDto } from '../dto/res/list-time-slots-query.dto';

@Injectable()
export class ListTimeSlotsUseCase {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: EventRepository,
    @InjectRepository(WeeklyHour)
    private readonly weeklyHourRepo: WeeklyHourRepository,
    @InjectRepository(DateOverride)
    private readonly dateOverrideRepo: DateOverrideRepository,
    @InjectRepository(Meeting)
    private readonly meetingRepo: MeetingRepository,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: ScheduleRepository,
  ) {}

  async execute({ eventId, month }: ListTimeSlotsQueryDto) {
    const allDatesInMonth = DateTimeHelper.getAllMonthDates(month);
    const startOfMonth = DateTimeHelper.getMonthStartDate(month);
    const endOfMonth = DateTimeHelper.getMonthEndDate(month);

    const timeSlotsMap = new Map<string, { slot: string; remaining: number }[]>(
      allDatesInMonth.map((date) => [date, []]),
    );

    const event = await this.eventRepo.findOneOrThrow(eventId, {
      populate: ['schedule', 'schedule.user'],
    });
    const [weeklyHours, dateOverrides, unavailableOverrides] =
      await Promise.all([
        this.weeklyHourRepo.find({ schedule: event.schedule }),
        this.dateOverrideRepo.find({
          schedule: event.schedule,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          startTime: { $ne: null },
          endTime: { $ne: null },
        }),
        this.dateOverrideRepo.find({
          schedule: event.schedule,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          startTime: null,
          endTime: null,
        }),
      ]);

    const weeklyHourDates = weeklyHours.flatMap(
      ({ weekday, startTime, endTime }) => {
        const dates = DateTimeHelper.getMonthDatesByWeekday(month, weekday);
        return dates.map((date) => ({ date, startTime, endTime }));
      },
    );
    weeklyHourDates.forEach(({ date, startTime, endTime }) => {
      const startTimes = DateTimeHelper.generatePossibleStartTimes(
        startTime,
        endTime,
        event.duration,
      );
      const slots = startTimes.map((time) => ({
        slot: time,
        remaining: event.inviteeLimit,
      }));
      timeSlotsMap.set(date, slots);
    });

    const overriddenDates = [
      ...dateOverrides.map(({ date }) => date),
      ...unavailableOverrides.map(({ date }) => date),
    ];
    overriddenDates.forEach((date) => timeSlotsMap.set(date, []));

    dateOverrides.forEach(({ date, startTime, endTime }) => {
      const startTimes = DateTimeHelper.generatePossibleStartTimes(
        startTime!,
        endTime!,
        event.duration,
      );
      const slots = startTimes.map((time) => ({
        slot: time,
        remaining: event.inviteeLimit,
      }));
      timeSlotsMap.get(date)?.push(...slots);
    });
    unavailableOverrides.forEach(({ date }) => timeSlotsMap.set(date, []));

    const hostSchedules = await this.scheduleRepo.find(
      { user: event.user },
      { fields: ['id'] },
    );
    const otherEvents = await this.eventRepo.find(
      {
        schedule: { $in: hostSchedules.map((s) => s.id) },
        id: { $ne: event.id },
      },
      { fields: ['id'] },
    );

    const otherMeetings = await this.meetingRepo.find(
      {
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
        event: { $in: otherEvents.map((e) => e.id) },
      },
      { populate: ['invitees:ref', 'event.duration'] },
    );
    otherMeetings.forEach(({ startTime, startDate, event: { duration } }) => {
      const dateKey = DateTimeHelper.formatDateString(startDate);
      const start = DateTimeHelper.formatTimeString(startTime);
      const end = DateTimeHelper.formatTimeString(
        DateTimeHelper.addMinutes(startTime, duration),
      );
      const slots = timeSlotsMap.get(dateKey) || [];
      timeSlotsMap.set(
        dateKey,
        slots.filter((slot) => slot.slot < start || slot.slot >= end),
      );
    });

    const meetings = await this.meetingRepo.find(
      {
        event,
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
      },
      { populate: ['invitees:ref'] },
    );

    meetings.forEach(({ startTime, startDate, invitees }) => {
      const dateKey = DateTimeHelper.formatDateString(startDate);
      const slotKey = DateTimeHelper.formatTimeString(startTime);
      const slots = timeSlotsMap.get(dateKey) || [];
      const slot = slots.find((s) => s.slot === slotKey);
      if (slot) {
        slot.remaining = Math.max(0, slot.remaining - invitees.length);
      }
    });

    const timeSlots = Array.from(timeSlotsMap.entries()).map(
      ([date, slots]) => ({
        date,
        slots: slots
          .filter((s) => s.remaining > 0)
          .toSorted((a, b) => a.slot.localeCompare(b.slot)),
      }),
    );

    return timeSlots;
  }
}
