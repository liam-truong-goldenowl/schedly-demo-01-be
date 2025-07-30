import { IANAZone } from 'luxon';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsTimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: any): boolean {
    if (typeof timezone !== 'string') return false;
    return IANAZone.isValidZone(timezone.trim());
  }

  defaultMessage(): string {
    return 'Timezone ($value) is not a valid IANA timezone.';
  }
}

export function IsTimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTimezone',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsTimezoneConstraint,
    });
  };
}
