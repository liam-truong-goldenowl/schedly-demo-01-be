import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { ReqUser } from '../interfaces/req-user.interface';

@Injectable()
export class UserOwnsResourceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userIdParam = request.params['userId'];
    const user = request.user as ReqUser;

    if (!user || !userIdParam) {
      throw new ForbiddenException('Access denied');
    }

    if (String(user.id) !== String(userIdParam)) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
