import { EntityManager } from '@mikro-orm/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import type { Request } from 'express';

import { Schedule } from '@/database/entities';
import { RequestUser } from '@/common/interfaces';
import { ScheduleNotFoundException } from '@/modules/schedule/exceptions';

@Injectable()
export class UserOwnsScheduleGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const reqUser = request.user as RequestUser;

    const userId = Number(reqUser.id);
    const scheduleIdParam = Number(
      request.params['scheduleId'] ||
        request.params['id'] ||
        request.body['scheduleId'],
    );

    const schedule = await this.em.findOne(
      Schedule,
      { id: scheduleIdParam },
      { populate: ['user'] },
    );

    if (!schedule) {
      throw new ScheduleNotFoundException(scheduleIdParam);
    }

    const userOwnsSchedule = schedule.user.id === userId;

    if (!userOwnsSchedule) {
      throw new ForbiddenException('You do not own this schedule');
    }

    return true;
  }
}
