import { Response } from 'express';
import { tap, Observable } from 'rxjs';
import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

import { ConfigService } from '@/config/config.service';

@Injectable()
export class UnsetTokensInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const { accessTokenKey, refreshTokenKey } =
          this.configService.getOrThrow('cookies');
        res.clearCookie(accessTokenKey);
        res.clearCookie(refreshTokenKey);
      }),
    );
  }
}
