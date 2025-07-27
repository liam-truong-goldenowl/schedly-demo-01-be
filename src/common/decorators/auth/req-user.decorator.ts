import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { ReqUser } from '@/common/interfaces/req-user.interface';

export const CurrentUser = createParamDecorator(
  (userKey: keyof ReqUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return userKey ? req.user[userKey] : req.user;
  },
);
