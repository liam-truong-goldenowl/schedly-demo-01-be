import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

import { WeeklyHour } from '@/database/entities';

@Injectable()
export class ScheduleOwnsWeeklyHourGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const weeklyHourId = Number(request.params['id']);
    const scheduleId = Number(request.params['scheduleId']);

    const ownedWeeklyHour = await this.em.findOne(WeeklyHour, {
      id: weeklyHourId,
      schedule: { id: scheduleId },
    });

    if (!ownedWeeklyHour) {
      throw new NotFoundException();
    }

    return true;
  }
}
