import { Request, Response, NextFunction } from 'express';
import { Logger, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;
    const startTime = Date.now();

    this.logger.log(
      `[Request] ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(
        `[Response] ${method} ${originalUrl} - Status: ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
