import { Request, Response } from 'express';
import {
  Catch,
  Logger,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';

import { AppException } from '../exceptions/app.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';

    if (exception instanceof AppException) {
      status = exception.getStatus();
      code = exception.code;
      message = (exception.getResponse() as any).message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = 'HTTP_ERROR';
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || res;
    }

    this.logger.error(
      `HTTP Status: ${status} | Error Message: ${JSON.stringify(message)}`,
      (exception as any).stack,
    );

    response.status(status).json({
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
