import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Weekday } from '../enums';

interface CustomValidationOptions extends ValidationOptions {
  required?: boolean;
}

/**
 * Custom validator constraint to check if a value is a valid Weekday.
 */
@ValidatorConstraint({ name: 'IsWeekday', async: false })
export class IsWeekdayConstraint implements ValidatorConstraintInterface {
  validate(weekday: any, args: ValidationArguments) {
    const [required] = args.constraints;

    // If not required and the value is null or undefined, consider it valid
    if (required === false && (weekday === null || weekday === undefined)) {
      return true;
    }

    // Otherwise, perform the actual validation
    return (
      typeof weekday === 'string' &&
      Object.values(Weekday).includes(weekday as Weekday)
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [required] = args.constraints;

    // Adjust message based on 'required' status if value is missing
    if (
      required === true &&
      (args.value === null || args.value === undefined)
    ) {
      return `${args.property} is required but not provided.`;
    }

    return `"${args.value}" is not a valid weekday. Allowed values are: ${Object.values(Weekday).join(', ')}`;
  }
}

/**
 * Custom decorator function to apply the IsWeekdayConstraint.
 * @param validationOptions Optional validation options, including 'required'.
 */
export function IsWeekday(validationOptions?: CustomValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions?.required ?? true], // Pass 'required' status as a constraint
      validator: IsWeekdayConstraint,
    });
  };
}
