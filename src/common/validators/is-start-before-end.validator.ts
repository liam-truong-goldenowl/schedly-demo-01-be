import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!propertyValue || !relatedValue) {
      return true;
    }

    // Validate time format HH:MM
    const isValidTime = (timeStr: string) => /^\d{2}:\d{2}$/.test(timeStr);

    // Let other validator handle validation if either value is not a valid time
    if (!isValidTime(propertyValue) || !isValidTime(relatedValue)) {
      return true;
    }

    // Convert HH:MM strings to comparable format (e.g., minutes from midnight)
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startTimeInMinutes = timeToMinutes(propertyValue);
    const endTimeInMinutes = timeToMinutes(relatedValue);

    return startTimeInMinutes < endTimeInMinutes;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return `${args.property} ($value) must be before ${relatedPropertyName} (${relatedValue}).`;
  }
}

export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeConstraint,
    });
  };
}
