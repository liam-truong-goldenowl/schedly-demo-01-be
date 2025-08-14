import {
  HttpStatus,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';

import type { ValidationError, INestApplication } from '@nestjs/common';

export const loadErrorHandling = (app: INestApplication): void => {
  const formatErrors = (errs: ValidationError[]): Record<string, string[]> => {
    const result: Record<string, string[]> = {};

    for (const err of errs) {
      if (err.constraints) {
        result[err.property] = Object.values(err.constraints);
      }
      if (err.children && err.children.length > 0) {
        const nested = formatErrors(err.children);
        for (const key in nested) {
          result[`${err.property}.${key}`] = nested[key];
        }
      }
    }

    return result;
  };

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Validation failed',
          errorCode: 'VALIDATION_ERROR',
          statusCode: HttpStatus.BAD_REQUEST,
          errors: formatErrors(errors),
        });
      },
    }),
  );
};
