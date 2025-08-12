import { DateTime } from 'luxon';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsYearMonth(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isYearMonth',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const dt = DateTime.fromFormat(value, 'yyyy-MM', { zone: 'utc' });
          return dt.isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid month in format YYYY-MM`;
        },
      },
    });
  };
}
