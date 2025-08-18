import { HttpStatus, HttpException } from '@nestjs/common';

export abstract class AppException extends HttpException {
  public readonly code: string;

  constructor(code: string, message: string, status: HttpStatus) {
    super({ code, message }, status);
    this.code = code;
  }
}

export class ValidationException extends AppException {
  constructor(message: any = 'Validation failed') {
    super('VALIDATION_ERROR', message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends AppException {
  constructor() {
    super('UNAUTHORIZED', 'Unauthorized access', HttpStatus.UNAUTHORIZED);
  }
}
