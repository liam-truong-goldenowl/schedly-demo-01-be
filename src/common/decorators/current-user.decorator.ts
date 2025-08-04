import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { IReqUser } from '@/common/interfaces';

export const CurrentUser = createParamDecorator(
  (userKey: keyof IReqUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return userKey ? req.user[userKey] : req.user;
  },
);
