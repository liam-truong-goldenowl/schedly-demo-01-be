import { Request } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { RequestUser } from '@/common/interfaces';

import { Event } from '../../../database/entities/event.entity';
import { EventNotFoundException } from '../exceptions/event-not-found.exception';

@Injectable()
export class UserOwnsEventGuard implements CanActivate {
  constructor(private em: EntityManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const reqUser = request.user as RequestUser;

    const userId = Number(reqUser.id);
    const eventIdParam = Number(
      request.params['eventId'] ?? request.params['id'],
    );

    const event = await this.em.findOne(Event, { id: eventIdParam });

    if (!event) {
      throw new EventNotFoundException(eventIdParam);
    }

    const userOwnsEvent = event.user.id === userId;

    if (!userOwnsEvent) {
      throw new ForbiddenException('You do not own this event');
    }

    return true;
  }
}
