import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class UserOwnsScheduleGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userIdParam = Number(request.params['userId']);
    const scheduleIdParam = Number(request.params['scheduleId']);

    const ownedSchedule = await this.em.findOne(Schedule, {
      id: scheduleIdParam,
      user: { id: userIdParam },
    });

    if (!ownedSchedule) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
