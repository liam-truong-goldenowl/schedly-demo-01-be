import { Injectable } from '@nestjs/common';

import { BaseJwtAuthGuard } from '@/common/guards/base-jwt-auth.guard';

@Injectable()
export class JwtRefreshAuthGuard extends BaseJwtAuthGuard {
  constructor() {
    super('jwt-refresh');
  }
}
