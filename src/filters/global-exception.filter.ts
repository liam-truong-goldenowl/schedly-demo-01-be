import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = exception.getResponse?.() ?? {};

    const message =
      typeof responseBody === 'string'
        ? responseBody
        : (responseBody.message ?? 'Internal Server Error');

    const errors = responseBody.errors ?? undefined;

    response.status(status).json({
      message,
      statusCode: status,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    });
  }
}
