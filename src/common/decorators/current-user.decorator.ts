import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { RequestUser } from '../interfaces/request-user.interface';

export const CurrentUser = createParamDecorator(
  (userKey: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return userKey ? req.user[userKey] : req.user;
  },
);
