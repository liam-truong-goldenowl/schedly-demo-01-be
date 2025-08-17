import { DateTime } from 'luxon';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsTodayOrLater(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      options,
      name: 'IsTodayOrLater',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: unknown) {
          if (!value || typeof value !== 'string') return false;
          const today = DateTime.utc().startOf('day');
          const date = DateTime.fromISO(value, { zone: 'utc' });
          if (!date.isValid) return true;
          return date >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be today or in the future`;
        },
      },
    });
  };
}
