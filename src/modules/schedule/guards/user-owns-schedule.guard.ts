import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { IReqUser } from '@/common/interfaces';

import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class UserOwnsScheduleGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const reqUser = request.user as IReqUser;

    const userId = Number(reqUser.id);
    const scheduleIdParam = Number(
      request.params['scheduleId'] ?? request.params['id'],
    );

    const ownedSchedule = await this.em.findOne(Schedule, {
      id: scheduleIdParam,
      user: { id: userId },
    });

    if (!ownedSchedule) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
