import { DateTime } from 'luxon';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

interface CustomValidationOptions extends ValidationOptions {
  required?: boolean;
}

/**
 * Custom validator constraint to check if a value is a valid time in HH:MM or HH:MM:SS format.
 */
@ValidatorConstraint({ name: 'IsTime', async: false })
export class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(time: any, args: ValidationArguments) {
    const [required] = args.constraints;

    // If not required and the value is null or undefined, consider it valid
    if (required === false && (time === null || time === undefined)) {
      return true;
    }

    // Otherwise, perform the actual validation
    if (typeof time !== 'string') {
      return false;
    }

    const dt = DateTime.fromFormat(time, 'HH:mm:ss');
    return dt.isValid;
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

    return `"${args.value}" is not a valid time format. Expected format is HH:MM:SS (e.g. 14:30:45).`;
  }
}

/**
 * Custom decorator function to apply the IsTimeConstraint.
 * @param validationOptions Optional validation options, including 'required'.
 */
export function IsTime(validationOptions?: CustomValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions?.required ?? true], // Pass 'required' status as a constraint
      validator: IsTimeConstraint,
    });
  };
}
