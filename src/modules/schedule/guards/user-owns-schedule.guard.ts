import { Request } from 'express';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { RequestUser } from '@/common/interfaces/request-user.interface';

import { ScheduleRepository } from '../repositories/schedule.repository';

@Injectable()
export class UserOwnsScheduleGuard implements CanActivate {
  constructor(private readonly scheduleRepo: ScheduleRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const reqUser = request.user as RequestUser;

    const userId = Number(reqUser.id);
    const scheduleIdParam = Number(request.params['scheduleId']);

    await this.scheduleRepo.findOneOrThrow({
      id: scheduleIdParam,
      user: { id: userId },
    });
    return true;
  }
}
