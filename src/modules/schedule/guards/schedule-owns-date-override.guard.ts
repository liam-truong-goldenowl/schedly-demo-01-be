import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

import { DateOverride } from '@/database/entities';

@Injectable()
export class ScheduleOwnsDateOverrideGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const dateOverrideId = Number(request.params['id']);
    const scheduleId = Number(request.params['scheduleId']);

    const ownedDateOverride = await this.em.findOne(DateOverride, {
      id: dateOverrideId,
      schedule: { id: scheduleId },
    });

    if (!ownedDateOverride) {
      throw new NotFoundException();
    }

    return true;
  }
}
