import {
  Catch,
  Logger,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    console.error('[GlobalExceptionFilter] Exception:', {
      name: exception?.name,
      message: exception?.message ?? String(exception),
      stack: exception?.stack,
    });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = exception.getResponse?.() ?? {};

    this.logger.error('Global exception caught', exception);

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
