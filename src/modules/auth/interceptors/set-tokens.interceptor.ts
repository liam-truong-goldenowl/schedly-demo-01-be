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
export class SetTokensInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((tokens) => {
        if (!tokens) return;

        const {
          accessTokenKey,
          accessTokenExpiresIn,
          refreshTokenKey,
          refreshTokenExpiresIn,
        } = this.configService.getOrThrow('cookies');
        const { isProd } = this.configService.getOrThrow('app');

        const accessExpirationDate = new Date(
          Date.now() + accessTokenExpiresIn,
        );
        const refreshExpirationDate = new Date(
          Date.now() + refreshTokenExpiresIn,
        );

        res.cookie(accessTokenKey, tokens.accessToken, {
          secure: isProd,
          httpOnly: true,
          expires: accessExpirationDate,
        });
        res.cookie(refreshTokenKey, tokens.refreshToken, {
          secure: isProd,
          httpOnly: true,
          expires: refreshExpirationDate,
        });
      }),
    );
  }
}
