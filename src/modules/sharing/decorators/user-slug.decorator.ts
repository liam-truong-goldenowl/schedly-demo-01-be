import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { USER_SLUG_PARAM } from '../sharing.config';

export const UserSlug = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const slug = request.params[USER_SLUG_PARAM];

    return slug;
  },
);
