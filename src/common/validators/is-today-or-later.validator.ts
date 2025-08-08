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

          try {
            const today = DateTime.utc().startOf('day');
            const date = DateTime.fromISO(value, { zone: 'utc' });

            if (!date.isValid) return false;

            return date >= today;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be today or in the future`;
        },
      },
    });
  };
}
